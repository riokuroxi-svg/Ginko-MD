/*  [ Ginko - Generador de QR ]
 *  Genera un código QR a partir de un texto/URL.
 *  Uso: .qrcode <texto o URL>
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'qrcode',
  tags: 'tools',
  command: ['qrcode', 'qr', 'qrgen'],
  description: 'Genera un código QR',
  example: 'qrcode https://github.com/riokuroxi-svg',
  tools: true,
  run: async (m, { sock, text }) => {
    if (!text) throw `❌ Escribe el texto/URL. Ej: ${m.prefix}qrcode hola mundo`
    m.reply('📱 *Generando QR...*')
    // API gratuita de generación de QR
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`
    await sock.sendMessage(m.chat, { image: { url }, caption: `📱 *QR generado*\n\n_Contenido: ${text}_\n\n${global.set.footer}` }, { quoted: m })
  }
}
