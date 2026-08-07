/*  [ Info Command ]
 *  Ginko - m.quoted (debug)
 *  Imprime el objeto del mensaje citado (JSON) para depuración.
 *  Solo owner.
 */
import { format } from "util"

export default {
  name: 'mquoted',
  tags: 'owner',
  command: ['mquoted', 'dump', 'debug'],
  description: 'Muestra el objeto JSON del mensaje citado (depuración)',
  example: 'responde a un mensaje',
  run: async (m, { sock }) => {
    if (!m.quoted) throw '❌ Responde al mensaje que quieres inspeccionar.'
    let obj = m.quoted.message || m.quoted
    let teks = `*Debug - m.quoted*\n\n` + '```' + format(obj) + '```'
    m.reply(teks)
  }
}
