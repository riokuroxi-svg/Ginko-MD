/*  [ Ginko - Tiktok Downloader con Fallback ]
 *  Descarga videos/imágenes de TikTok con fallback múltiple de APIs.
 *  Uso: .tiktok <url>
 */
import { tiktokDl } from '../../system/lib/tiktokDl.js'

export default {
  name: 'tiktok',
  tags: 'download',
  command: ['tiktok', 'tiktokslide', 'tt', 'ttslide'],
  description: 'Descarga videos/imágenes de TikTok',
  example: Func.example('%p', '%cmd', 'https://vt.tiktok.com/ZSYaEoF55'),
  limit: false,
  run: async (m, { sock, args }) => {
    if (!args[0] || !args[0].match('tiktok.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
    try {
      const res = await tiktokDl(args[0])

      // Si es un slide (imágenes múltiples)
      if (res.images && res.images.length) {
        let teks = `*[ Tiktok Slide ]*\n\n`
        teks += `*-* *Autor* : ${res.author || 'null'}\n`
        teks += `*-* *Desc* : ${res.title || ''}\n`
        teks += `*-* *Imágenes* : ${res.images.length}\n\n`
        teks += global.set.footer
        for (let x of res.images) {
          await sock.sendMessage(m.chat, { image: { url: x }, caption: teks }, { quoted: m })
        }
        return
      }

      // Video normal + audio
      if (res.play) {
        let teks = `*[ Tiktok ]*\n\n`
        teks += `*-* *Autor* : ${res.author || 'null'}\n`
        teks += `*-* *Desc* : ${res.title || 'Tidak ada'}\n`
        teks += `*-* *Duración* : ${res.duration || 'Tidak ada'}\n`
        teks += `*-* *Descarga* : ${((new Date - old) * 1)} ms\n\n`
        teks += global.set.footer
        const ttvideo = await sock.sendMessage(m.chat, { video: { url: res.play, caption: teks } }, { quoted: m })
        if (res.music) {
          await sock.sendMessage(m.chat, { audio: { url: res.music, mimetype: "audio/mpeg", ptt: false }}, { quoted: ttvideo })
        }
        return
      }

      return m.reply(global.status.error)
    } catch (e) {
      console.error('[TikTok]', e.message)
      return m.reply('❌ No se pudo descargar el TikTok. Intenta de nuevo o prueba con otra URL.')
    }
  }
}
