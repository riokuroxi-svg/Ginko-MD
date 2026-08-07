/*  [ Ginko - Gemini AI ]
 *  Chat con IA de Google Gemini.
 *  Uso: .gemini <pregunta>
 */
import { geminiChat } from "../../storage/script/geminiAI.js"

export default {
  name: 'gemini',
  tags: 'tools',
  command: ['gemini', 'geminiia', 'googleai'],
  description: 'Chat con IA Google Gemini',
  example: 'gemini hola',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'gemini', 'hola')
    m.reply(global.status.wait)
    try {
      const resp = await geminiChat(text)
      m.reply(resp)
    } catch (e) {
      console.error('[Gemini]', e)
      return m.reply(e.message || '❌ Error con la IA.')
    }
  }
}
