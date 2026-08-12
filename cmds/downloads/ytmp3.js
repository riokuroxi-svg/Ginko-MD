import yts from 'yt-search'
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

// Configurar ffmpeg con el binario estático para que funcione sin instalación global
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath)

const cmd = {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloads',
  description: 'Descargar una canción de YouTube.',

  run: async ({ msg, sock, args, usedPrefix, command }) => {
    try {
      if (!args[0]) {
        return msg.reply('《✧》Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const input_text = args.join(' ').trim()
      const video_id = getVideoId(input_text)
      const query = video_id ? `https://youtu.be/${video_id}` : input_text

      let url = query
      let title = 'audio'
      let thumbnail = null

      try {
        const video_info = await getVideoInfo(query, video_id)

        if (video_info) {
          url = video_info.url || `https://youtu.be/${video_info.videoId}`
          title = video_info.title || title
          thumbnail = video_info.image || video_info.thumbnail || null

          const views = Number(video_info.views || 0).toLocaleString('es-HN')
          const channel = video_info.author?.name || video_info.author || 'Desconocido'

          const info_message = `➩ Descargando › *${title}*

> ❖ Canal › *${channel}*
> ⴵ Duración › *${video_info.timestamp || 'Desconocido'}*
> ❀ Vistas › *${views}*
> ✩ Publicado › *${video_info.ago || 'Desconocido'}*
> ❒ Enlace › *${url}*`

          if (thumbnail) {
            await sock.sendMessage(msg.chat, {
              image: { url: thumbnail },
              caption: info_message
            }, { quoted: msg })
          } else {
            await msg.reply(info_message)
          }
        }
      } catch {}

      if (!isYTUrl(url)) {
        return msg.reply('《✧》No se encontró un video válido de YouTube.')
      }

      await msg.react('⏳')
      const audio = await getAudioFromApi(url)

      if (!audio?.buffer?.length) {
        await msg.react('❌')
        return msg.reply('《✧》No se pudo descargar el *audio*, intenta más tarde.')
      }

      // Convertir a OGG/Opus para que WhatsApp lo reproduzca como nota de voz
      // con duración correcta (todos los bots estables hacen esto)
      const oggBuffer = await convertToOpus(audio.buffer)
      
      await sock.sendMessage(msg.chat, {
        audio: oggBuffer,
        fileName: audio.name || `${title}.mp3`,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true // Enviar como nota de voz (reproduce automáticamente, muestra duración)
      }, { quoted: msg })

      await msg.react('✅')
    } catch (e) {
      console.error('Error en play:', e)
      await msg.reply(
        `> Ocurrió un error al descargar el audio: ${e?.message || 'error desconocido'}`
      )
    }
  }
}

export default cmd

const isYTUrl = (url = '') =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url)

const getVideoId = (text = '') => {
  const raw = String(text || '').trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/
  ]

  for (const pattern of patterns) {
    const match = raw.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

async function getVideoInfo(input, video_id) {
  if (video_id) {
    try {
      const info = await yts({ videoId: video_id })
      if (info?.videoId) {
        return {
          ...info,
          url: `https://youtu.be/${info.videoId}`,
          image: info.thumbnail || info.image
        }
      }
    } catch {}
  }

  const search = await yts(input)
  return search.videos?.[0] || search.all?.find(v => v.type === 'video') || null
}

async function getAudioFromApi(url) {
  const api_url = `https://api.lempi.lat/dl/yta?url=${encodeURIComponent(url)}&apikey=montekey28`
  
  const res = await fetch(api_url, {
    headers: { 'accept': 'application/json' }
  })

  if (!res.ok) throw new Error(`API falló: HTTP ${res.status}`)

  const json = await res.json()

  if (!json?.status || !json?.datos?.url) {
    throw new Error('No se encontró el enlace de descarga en la API.')
  }

  const audio_res = await fetch(json.datos.url)
  if (!audio_res.ok) throw new Error(`No se pudo descargar el audio: HTTP ${audio_res.status}`)

  const buffer = await audio_res.buffer()

  return {
    buffer,
    name: json.datos.archivo || 'audio.mp3'
  }
}

/**
 * Convierte un buffer MP3 a OGG/Opus (formato de notas de voz de WhatsApp)
 * usando ffmpeg. Esto garantiza que la duración se muestre correctamente
 * y el audio se reproduzca automáticamente.
 */
function convertToOpus(inputBuffer) {
  return new Promise((resolve, reject) => {
    const tmpPathIn = path.join(tmpdir(), `ginko-${randomBytes(8).toString('hex')}.mp3`)
    const tmpPathOut = path.join(tmpdir(), `ginko-${randomBytes(8).toString('hex')}.ogg`)
    
    fs.writeFile(tmpPathIn, inputBuffer)
      .then(() => {
        ffmpeg(tmpPathIn)
          .toFormat('ogg')
          .audioCodec('libopus')
          .audioBitrate('128k')
          .audioChannels(2)
          .audioFrequency(48000)
          .outputOptions([
            '-acodec libopus',
            '-application voip' // Optimizado para voz/audio en WhatsApp
          ])
          .on('end', async () => {
            try {
              const converted = await fs.readFile(tmpPathOut)
              // Limpiar archivos temporales
              await Promise.all([fs.unlink(tmpPathIn), fs.unlink(tmpPathOut)])
              resolve(converted)
            } catch (e) {
              reject(e)
            }
          })
          .on('error', async (err) => {
            // Si la conversión falla por alguna razón (ffmpeg no instalado en Termux),
            // devolvemos el MP3 original como fallback para no romper el comando
            try { await Promise.all([fs.unlink(tmpPathIn), fs.unlink(tmpPathOut).catch(() => {})]) } catch {}
            console.warn('Conversión opus falló, enviando MP3 como fallback:', err.message)
            resolve(inputBuffer)
          })
          .save(tmpPathOut)
      })
      .catch(reject)
  })
}
