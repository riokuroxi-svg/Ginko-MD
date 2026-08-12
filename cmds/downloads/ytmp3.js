import yts from 'yt-search'
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Usar ffmpeg INSTALADO EN EL SISTEMA (el que se instala con `pkg install ffmpeg` en Termux).
// Si ffmpeg no está disponible, enviamos el MP3 directamente sin conversión para que el comando no falle.
let ffmpegAvailable = false
try {
  // Verificar si ffmpeg existe en el sistema
  execSync('which ffmpeg', { stdio: 'ignore' })
  ffmpegAvailable = true
} catch {
  ffmpegAvailable = false
  console.log('⚠️  ffmpeg no encontrado en el sistema - los audios se enviarán como MP3. Instálalo con "pkg install ffmpeg" para duración exacta.')
}

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

      const audio = await getAudioFromApi(url)

      if (!audio?.buffer?.length) {
        return msg.reply('《✧》No se pudo descargar el *audio*, intenta más tarde.')
      }

      // Si ffmpeg está disponible, convertir a OGG/Opus para duración exacta.
      // Si NO está disponible (ej: Termux sin pkg install ffmpeg), enviar MP3 directamente.
      let finalBuffer = audio.buffer
      let mimetype = 'audio/mpeg'
      let fileName = `${sanitizeFilename(title)}.mp3`

      if (ffmpegAvailable) {
        try {
          finalBuffer = await convertToOpus(audio.buffer)
          mimetype = 'audio/ogg; codecs=opus'
        } catch (e) {
          console.log('Conversión a opus falló, enviando MP3:', e.message)
          // Fallback a MP3 si la conversión falla
        }
      }

      // Enviar como AUDIO NORMAL (no nota de voz PTT) para que aparezca el nombre real del archivo
      await sock.sendMessage(msg.chat, {
        audio: finalBuffer,
        fileName: fileName,
        mimetype: mimetype
      }, { quoted: msg })

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

// Limpiar caracteres no válidos en nombres de archivo
function sanitizeFilename(name = 'audio') {
  return String(name)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'audio'
}

/**
 * Convierte un buffer MP3 a OGG/Opus (formato de audio de WhatsApp)
 * usando el ffmpeg INSTALADO EN EL SISTEMA.
 * Se llama solo si ffmpeg está disponible.
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
            // Limpiar temporales y devolver error
            try { await Promise.all([fs.unlink(tmpPathIn), fs.unlink(tmpPathOut).catch(() => {})]) } catch {}
            reject(err)
          })
          .save(tmpPathOut)
      })
      .catch(reject)
  })
}
