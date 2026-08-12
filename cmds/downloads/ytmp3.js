import yts from 'yt-search'
import fetch from 'node-fetch'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const ID3 = require('node-id3')

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
      let channel = 'Desconocido'

      try {
        const video_info = await getVideoInfo(query, video_id)

        if (video_info) {
          url = video_info.url || `https://youtu.be/${video_info.videoId}`
          title = video_info.title || title
          thumbnail = video_info.image || video_info.thumbnail || null
          channel = video_info.author?.name || video_info.author || 'Desconocido'

          const views = Number(video_info.views || 0).toLocaleString('es-HN')

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

      // MP3 directo de la API, SIN conversión.
      // Incrustamos etiquetas ID3 (título, artista, álbum, portada) dentro del archivo
      // para que al abrirlo en un reproductor de música aparezca con nombre y carátula.
      // Si escribir tags falla por cualquier razón, mandamos el MP3 tal cual para no romper el comando.
      let finalBuffer = audio.buffer
      try {
        finalBuffer = await addId3Tags(audio.buffer, { title, artist: channel, thumbnail })
      } catch (e) {
        console.log('⚠️  No se pudieron escribir ID3 tags, enviando MP3 sin tags:', e.message)
      }

      const fileName = `${sanitizeFilename(title)}.mp3`

      await sock.sendMessage(msg.chat, {
        audio: finalBuffer,
        fileName: fileName,
        mimetype: 'audio/mpeg'
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

function sanitizeFilename(name = 'audio') {
  return String(name)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'audio'
}

/**
 * Escribe etiquetas ID3v2 en el buffer MP3 (título, artista, álbum, portada).
 * Retorna un nuevo buffer con los tags incrustados.
 * Usa node-id3, que es puro JavaScript (sin dependencias nativas,
 * funciona perfecto en Termux).
 */
async function addId3Tags(mp3Buffer, { title, artist, thumbnail }) {
  const tags = {
    title: title || 'Audio',
    artist: artist || 'Desconocido',
    album: 'Descargado con Ginko-MD',
    performerInfo: 'Ginko-MD'
  }

  // Descargar la portada y agregarla como APIC (front cover)
  if (thumbnail) {
    try {
      const coverRes = await fetch(thumbnail, {
        headers: { 'user-agent': 'Mozilla/5.0' }
      })
      if (coverRes.ok) {
        const coverBuf = Buffer.from(await coverRes.arrayBuffer())
        // Detectar mime real (YouTube usualmente devuelve jpg)
        const sig = coverBuf.slice(0, 4).toString('hex')
        let mime = 'image/jpeg'
        if (sig.startsWith('89504e47')) mime = 'image/png'
        else if (sig.startsWith('474946')) mime = 'image/gif'
        else if (sig.startsWith('52494646')) mime = 'image/webp'
        // node-id3 APIC soporta jpeg/png/gif
        if (mime !== 'image/webp') {
          tags.image = {
            mime: mime,
            type: { id: 3, name: 'front cover' },
            description: 'cover',
            imageBuffer: coverBuf
          }
        }
      }
    } catch (e) {
      console.log('⚠️  No se pudo descargar la portada:', e.message)
    }
  }

  // write(tags, buffer) devuelve un NUEVO buffer con los tags al inicio
  const tagged = ID3.write(tags, mp3Buffer)
  return Buffer.isBuffer(tagged) ? tagged : mp3Buffer
}
