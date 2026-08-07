/*  [ Ginko - Recordatorio Programado ]
 *  Programa un recordatorio que el bot enviará al chat en el momento indicado.
 *  Función adaptada de bots extranjeros (scheduler message / reminder).
 *  Uso: .recordar <minutos>|mensaje
 *  Ej: .recordar 5|tomar agua
 */
let reminders = []

export default {
  name: 'recordatorio',
  tags: 'tools',
  command: ['recordar', 'recordatorio', 'reminder', 'alarma'],
  description: 'Programa un recordatorio (en minutos)',
  example: 'recordar 5|tomar agua',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'recordar', '5|tomar agua')
    const [minsRaw, ...msgArr] = text.split('|')
    const msg = msgArr.join('|').trim()
    const mins = parseInt(minsRaw)
    if (isNaN(mins) || mins < 1) throw '❌ Debe ser un número de minutos (mínimo 1).'
    if (!msg) throw '❌ Escribe el mensaje del recordatorio.'

    const jid = m.chat
    const delayMs = mins * 60000

    const timer = setTimeout(async () => {
      try {
        await sock.sendMessage(jid, { text: `⏰ *Recordatorio:* ${msg}\n\n_Programado hace ${mins} min._` })
      } catch (e) {}
      reminders = reminders.filter(r => r.timer !== timer)
    }, delayMs)

    reminders.push({ timer, jid, msg, mins })
    m.reply(`✅ *Recordatorio programado* para dentro de *${mins} min*.\n\n> 📝 "${msg}"`)
  }
}
