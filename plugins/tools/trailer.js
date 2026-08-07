/*  [ Ginko - Tráiler de Película/Serie ]
 *  Busca el tráiler de una película o serie y lo envía como video.
 *  Usa solo YouTube (sin API key, fiable).
 *  Uso: .trailer <nombre>
 */
import yts from 'yt-search'

export default {
  name: 'trailer',
  tags: 'tools',
  command: ['trailer', 'traler'],
  description: 'Busca el tráiler de una película o serie',
  example: 'trailer venom',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'trailer', 'venom')
    m.reply('🎬 *Buscando tráiler...*')
    try {
      // Buscar el tráiler en YouTube
      const search = await yts(`${text} trailer oficial`)
      const trailer = search.videos?.[0]
      if (!trailer) return m.reply(`❌ No encontré el tráiler de *${text}*.`)

      const teks = `🎬 *Tráiler de ${text}*\n\n`
        + `*Título:* ${trailer.title}\n`
        + `*Duración:* ${trailer.timestamp || 'N/A'}\n`
        + `*Vistas:* ${(trailer.views || 0).toLocaleString()}\n\n`
        + global.set.footer

      // Enviar el video del tráiler
      await sock.sendMessage(m.chat, {
        video: { url: trailer.url },
        caption: teks,
        contextInfo: { externalAdReply: { title: trailer.title, thumbnailUrl: trailer.thumbnail, sourceUrl: trailer.url } }
      }, { quoted: m })

    } catch (e) {
      console.error('[Trailer]', e.message)
      m.reply('❌ No se pudo buscar el tráiler. Intenta de nuevo.')
    }
  }
}
