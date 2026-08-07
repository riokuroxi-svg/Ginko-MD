/*  [ Ginko - Crear Contacto (VCard) ]
 *  Crea una tarjeta de contacto con un nombre y número.
 *  Uso: .vcard <nombre>|<número>
 *  Ej: .vcard Carlos|5215574370309
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'vcard',
  tags: 'tools',
  command: ['vcard', 'contacto'],
  description: 'Crea una tarjeta de contacto',
  example: 'vcard Nombre|Número',
  tools: true,
  run: async (m, { sock, text }) => {
    if (!text || !text.includes('|')) throw `❌ Uso: ${m.prefix}vcard Nombre|Número`
    const [nombre, numRaw] = text.split('|').map(x => x.trim())
    const numero = numRaw.replace(/[^0-9]/g, '')
    if (!nombre || !numero) throw '❌ Nombre y número requeridos.'

    const vcard = 'BEGIN:VCARD\n'
      + 'VERSION:3.0\n'
      + `FN:${nombre}\n`
      + `TEL;type=CELL;type=VOICE;waid=${numero}:+${numero}\n`
      + 'END:VCARD'

    await sock.sendMessage(m.chat, {
      contacts: { displayName: nombre, contacts: [{ vcard }] }
    }, { quoted: m })
  }
}
