/*  [ Ginko - Menfess (Mensaje Anónimo / Confesión) ]
 *  Envía un mensaje anónimo a un número o grupo, sin revelar al remitente.
 *  Función adaptada de bots indonesios (menfess = confess).
 *  Uso: .menfess <número>|mensaje
 *  Ej: .menfess 5215574370309|hola, me gusta tu estilo
 */
export default {
  name: 'menfess',
  tags: 'tools',
  command: ['menfess', 'confess', 'confesion'],
  description: 'Envía un mensaje anónimo a un número',
  example: 'menfess número|mensaje',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'menfess', '5215574370309|mensaje')
    const [targetRaw, ...msgArr] = text.split('|')
    const msg = msgArr.join('|').trim()
    if (!targetRaw || !msg) throw '❌ Formato: número|mensaje'

    const target = targetRaw.replace(/[^0-9]/g, '')
    if (target.length < 8) throw '❌ Número inválido.'
    const jid = target + '@s.whatsapp.net'

    try {
      const teks = `🗣️ *MENFESS*\n\n_Alguien te envió un mensaje anónimo:_\n\n> "${msg}"\n\n_No se puede responder a este mensaje._\n` + global.set.footer
      await sock.sendMessage(jid, { text: teks })
      m.reply('✅ *Mensaje anónimo enviado.* (El destinatario no sabrá quién eres)')
    } catch (e) {
      console.error('[Menfess]', e)
      throw '❌ No pude enviar el mensaje. ¿El número es válido y existe en WhatsApp?'
    }
  }
}
