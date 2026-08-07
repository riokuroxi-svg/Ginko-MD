/*  [ Info Command ]
 *  Ginko - Encuesta (poll)
 *  Crea una encuesta interactiva de WhatsApp.
 *  Uso: .encuesta Nombre de la encuesta | opcion1 | opcion2 | opcion3
 */
export default {
  name: 'encuesta',
  tags: 'tools',
  command: ['encuesta', 'poll', 'votacion'],
  description: 'Crea una encuesta interactiva',
  example: 'encuesta Título | opción1 | opción2 | opción3',
  run: async (m, { sock, text }) => {
    if (!text) throw `❌ *Ejemplo:* ${m.prefix}encuesta ¿Qué pizza quieres? | Pepperoni | Hawaiana | 4 Quesos`

    const partes = text.split('|').map(x => x.trim())
    const name = partes.shift()
    const values = partes.slice(0, 10) // WhatsApp permite hasta 12 opciones
    if (!name || values.length < 2) throw '❌ Debes poner un título y al menos 2 opciones separadas por `|`.'

    if (sock.sendPoll) {
      await sock.sendPoll(m.chat, name, values, { selectableCount: 1, quoted: m })
    } else {
      // Fallback si la librería no tiene sendPoll
      m.reply(`*📊 ${name}*\n\n${values.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)
    }
  }
}
