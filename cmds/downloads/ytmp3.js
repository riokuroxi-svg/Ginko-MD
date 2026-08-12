import yts from 'yt-search'
import fetch from 'node-fetch'

// Número máximo de intentos de descarga (reintentos cuando la API da 404/error)
const MAX_REINTENTOS = 3
// Pausa base entre reintentos en ms (1er intento falla -> espera 1.5s, luego 3s)
const ESPERA_BASE_MS = 1500

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

      // Reintentos automáticos: si la API da 404/error o el archivo no es un MP3 válido,
      // volvemos a intentarlo con pausa entre intentos. Esto soluciona los fallos
      // transitorios de la API externa (enlaces 404 que a veces devuelve lempi.lat).
      let audio = null
      let ultimoError = null

      for (let intento = 1; intento <= MAX_REINTENTOS; intento++) {
        try {
          console.log(`[play] Intento ${intento}/${MAX_REINTENTOS} -> ${title}`)
          const intentoAudio = await getAudioFromApi(url)

          if (intentoAudio?.buffer?.length && esMp3Valido(intentoAudio.buffer)) {
            audio = intentoAudio
            console.log(`[play] ✅ Descarga OK en intento ${intento} (${(audio.buffer.length/1024/1024).toFixed(2)} MB)`)
            break
          } else {
            ultimoError = 'El archivo descargado no es un MP3 válido'
            console.log(`[play] ⚠️  Intento ${intento}: buffer no válido (no es MP3), reintentando...`)
          }
        } catch (e) {
          ultimoError = e
          console.log(`[play] ⚠️  Intento ${intento} falló: ${e.message}`)
        }

        if (intento < MAX_REINTENTOS) {
          const espera = ESPERA_BASE_MS * intento
          console.log(`[play] Esperando ${espera}ms antes del siguiente intento...`)
          await dormir(espera)
        }
      }

      if (!audio?.buffer?.length) {
        const msj = ultimoError?.message || String(ultimoError || '')
        return msg.reply(
          `《✧》No se pudo descargar el *audio* después de ${MAX_REINTENTOS} intentos` +
          (msj ? ` (${msj})` : '') +
          '.\n> Intenta de nuevo en unos segundos o con otra canción.'
        )
      }

      // MP3 directo de la API, SIN conversión.
      // mimetype audio/mpeg => WhatsApp lo muestra como archivo de audio normal
      // (no como nota de voz redonda), reproduce con duración correcta
      // y muestra el nombre real de la canción.
      const fileName = `${sanitizeFilename(title)}.mp3`

      await sock.sendMessage(msg.chat, {
        audio: audio.buffer,
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

/**
 * Descarga el audio de YouTube usando la API de lempi.lat.
 * Se llama una vez por reintento.
 * Valida que el link de descarga devuelto responda 200 y que el contenido
 * tenga al menos 10 KB (evita archivos vacíos/HTML de error disfrazado de .mp3).
 */
async function getAudioFromApi(url) {
  const api_url = `https://api.lempi.lat/dl/yta?url=${encodeURIComponent(url)}&apikey=montekey28`

  // Timeout de 20s para la petición a la API de metadata
  const ctrlMeta = new AbortController()
  const toMeta = setTimeout(() => ctrlMeta.abort(), 20000)
  let res
  try {
    res = await fetch(api_url, {
      headers: { 'accept': 'application/json' },
      signal: ctrlMeta.signal
    })
  } finally {
    clearTimeout(toMeta)
  }

  if (!res.ok) throw new Error(`API respondió HTTP ${res.status}`)

  const json = await res.json()

  if (!json?.status || !json?.datos?.url) {
    throw new Error('La API no devolvió enlace de descarga (puede estar saturada)')
  }

  // Timeout de 60s para la descarga del archivo de audio
  const ctrlAudio = new AbortController()
  const toAudio = setTimeout(() => ctrlAudio.abort(), 60000)
  let audio_res
  try {
    audio_res = await fetch(json.datos.url, { signal: ctrlAudio.signal })
  } finally {
    clearTimeout(toAudio)
  }
  if (!audio_res.ok) {
    throw new Error(`Enlace de audio roto (HTTP ${audio_res.status})`)
  }

  const buffer = await audio_res.buffer()

  // Validar tamaño mínimo: un MP3 válido de música rara vez pesa menos de 50 KB
  if (buffer.length < 50 * 1024) {
    throw new Error(`Archivo demasiado pequeño (${buffer.length} bytes), probablemente corrupto`)
  }

  return {
    buffer,
    name: json.datos.archivo || 'audio.mp3'
  }
}

/**
 * Verifica si un buffer realmente empieza con cabecera de MP3 (ID3v2)
 * o con un frame sync de MPEG (0xFF 0xE0). Esto evita que enviemos
 * páginas HTML de error o archivos corruptos cuando la API se cae a medias.
 */
function esMp3Valido(buf) {
  if (!buf || buf.length < 4) return false
  // Caso 1: Header ID3v2 (estándar en MP3 con metadatos)
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return true // "ID3"
  // Caso 2: Frame sync MPEG sin ID3 (primer frame 0xFF 0xE0)
  if (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0) return true
  return false
}

const dormir = (ms) => new Promise(r => setTimeout(r, ms))

function sanitizeFilename(name = 'audio') {
  return String(name)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'audio'
}
