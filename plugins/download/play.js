/*  [ Ginko - Reproductor de YouTube (Audio/Video) con botones ]
 *  Busca música/video de YouTube y muestra botones para elegir audio o video.
 *
 *  Uso:
 *   .play <nombre>   → busca y muestra botones [Audio] [Video]
 *   .playa <nombre>  → descarga audio directo
 *   .playv <nombre>  → descarga video directo
 *
 *  Los botones usan quick_reply: al pulsarlos, WhatsApp envía el comando
 *  (.playa <título> o .playv <título>) que el bot ejecuta.
 */
import yts from 'yt-search';
import { ytdl } from '../../system/lib/ytscrap.js';

// Guardar la búsqueda por título para que el botón pueda re-ejecutar
const ultimaBusqueda = {} // { chatId: { video, videoUrl, text } }

export default {
  name: 'play',
  tags: 'download',
  command: ['play', 'playa', 'playv', 'playaudio', 'playvideo'],
  description: 'Reproduce música (audio) o video de YouTube',
  example: Func.example('%p', '%cmd', 'photograph'),
  limit: false,
  // Captura los botones pulsados (audio/video)
  async before(m) {
    // Detecta si el mensaje es una respuesta de botón de play
    const body = (m.body || '').trim().toLowerCase()
    const chatData = ultimaBusqueda[m.chat]
    if (!chatData) return true
    if (body === 'audio' || body === 'video' || body === '🎵 audio' || body === '🎬 video') {
      const { video, videoUrl } = chatData
      const esVideo = body.includes('video')
      const { sock } = global
      try {
        // Avisar y descargar
        await this.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } })
        const msgFalso = m
        await descargar(msgFalso, sock, video, videoUrl, esVideo, video.title)
        delete ultimaBusqueda[m.chat]
      } catch (e) {
        console.error('[play botón]', e)
      }
      return false // consumido
    }
    return true
  },
  run: async (m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'photograph'));

    const esVideo = command === 'playv' || command === 'playvideo'
    const esAudio = command === 'playa' || command === 'playaudio'

    try {
      m.reply(global.status.wait);

      let search = await yts(text);
      if (!search.videos.length) return m.reply('No se encontraron resultados.');

      const video = search.videos[0];
      const videoUrl = video.url;

      // Si viene de un botón (audio/video directo)
      if (esVideo || esAudio) {
        return descargar(m, sock, video, videoUrl, esVideo, text);
      }

      // Modo normal: guardar y mostrar con botones
      ultimaBusqueda[m.chat] = { video, videoUrl, text };

      const teks = `🎵 *Resultado encontrado:*\n\n`
        + `*Título:* ${video.title}\n`
        + `*Autor:* ${video.author?.name || 'N/A'}\n`
        + `*Duración:* ${video.timestamp || 'N/A'}\n`
        + `*Vistas:* ${(video.views || 0).toLocaleString()}\n\n`
        + `*Elige una opción:*`;

      // Enviar con miniatura + botones
      if (sock.sendButtonReply) {
        await sock.sendMessage(m.chat, { image: { url: video.thumbnail }, caption: teks }, { quoted: m });
        await sock.sendButtonReply(m.chat, teks, [
          { displayText: '🎵 Audio', id: 'audio' },
          { displayText: '🎬 Video', id: 'video' }
        ], 'Selecciona para descargar', m);
      } else {
        // Fallback: mostrar comandos
        m.reply(teks + `\n\n▸ *Audio* → ${m.prefix}playa ${video.title}\n▸ *Video* → ${m.prefix}playv ${video.title}`);
      }

    } catch (error) {
      console.error('Error en el comando play:', error);
      m.reply('Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.');
    }
  }
};

async function descargar(m, sock, video, videoUrl, esVideo, text) {
  try {
    let response = await ytdl(videoUrl);
    if (!response || !response.data) return m.reply('No se pudo obtener el archivo.');

    if (esVideo) {
      const url = response.data.mp4 || response.data.video || response.data.link
      if (!url) return m.reply('No se pudo obtener el video.');
      return sock.sendMessage(m.chat, {
        video: { url },
        caption: `🎬 *${video.title}*\n\n${global.set.footer}`,
        contextInfo: { externalAdReply: { title: video.title, thumbnailUrl: video.thumbnail, sourceUrl: videoUrl } }
      }, { quoted: m });
    }

    const url = response.data.mp3 || response.data.audio
    if (!url) return m.reply('No se pudo obtener el audio.');
    return sock.sendMessage(m.chat, {
      document: { url },
      mimetype: "audio/mpeg",
      fileName: video.title + ".mp3",
      contextInfo: { externalAdReply: { title: video.title, thumbnailUrl: video.thumbnail, sourceUrl: videoUrl } }
    }, { quoted: m });
  } catch (e) {
    console.error('Error descargando:', e.message);
    m.reply('Ocurrió un error al descargar. Intenta de nuevo.');
  }
}
