/*  [ Ginko - Descarga Mega ]
 *  Descarga archivos de Mega.nz.
 *  Uso: .mega <enlace-mega>
 */
export default {
  name: 'mega',
  tags: 'download',
  command: ['mega', 'meganf'],
  description: 'Descarga archivos de Mega.nz',
  example: 'mega https://mega.nz/file/XXXX',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text || !text.includes('mega.nz')) return m.reply(`❌ Envía un enlace de Mega.\nEjemplo: ${m.prefix}mega https://mega.nz/file/XXXX`)
    m.reply(global.status.wait)
    try {
      const ha = await fetch(`https://deliriussapi-oficial.vercel.app/download/mega?url=${encodeURIComponent(text)}`)
      const data = await ha.json()
      const link = data?.data?.link || data?.link || data?.url
      if (!link) throw 'no-link'
      const name = data?.data?.name || data?.name || 'archivo'
      const size = data?.data?.size || data?.size || ''
      await sock.sendMessage(m.chat, {
        document: { url: link },
        mimetype: '*/*',
        fileName: name,
      }, { quoted: m })
    } catch (e) {
      console.error('[Mega]', e)
      throw '❌ No pude descargar el archivo. Verifica el enlace o inténtalo de nuevo.'
    }
  }
}
