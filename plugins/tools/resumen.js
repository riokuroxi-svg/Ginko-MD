/*  [ Ginko - Resumen de Conversación con IA ]
 *  Genera un resumen de la conversación reciente del grupo usando IA (Gemini).
 *  Uso: .resumen  (resume los últimos mensajes si el store está disponible)
 */
import { geminiChat } from "../../storage/script/geminiAI.js"

export default {
  name: 'resumen',
  tags: 'tools',
  command: ['resumen', 'resumir', 'summary'],
  description: 'Resume la conversación reciente del grupo con IA',
  example: 'resumen 20',
  limit: false,
  run: async (m, { sock, text }) => {
    m.reply(global.status.wait)

    // Intentar obtener mensajes recientes del store
    let historial = []
    try {
      const store = global.store
      const jid = m.chat
      const msgs = store?.messages?.[jid] || {}
      const lista = Object.values(msgs).filter(msg => !msg.key?.fromMe && msg.message?.conversation)
      historial = lista.slice(-25).map(msg => msg.message.conversation)
    } catch (e) {}

    if (historial.length < 3) {
      return m.reply('❌ No hay suficiente historial en memoria para resumir.\n\n> Cita un mensaje reciente o usa `.resumen <n>` en un grupo activo.')
    }

    const resumenTexto = historial.join('\n')
    try {
      const sysPrompt = 'Eres un asistente que resume conversaciones de WhatsApp en español. Da un resumen claro y breve en puntos.'
      const resumen = await geminiChat(`Resume esta conversación de grupo:\n\n${resumenTexto}`, sysPrompt)
      return m.reply(`📋 *Resumen de la conversación:*\n\n${resumen}\n\n${global.set.footer}`)
    } catch (e) {
      console.error('[Resumen]', e)
      throw e.message || '❌ Error al generar el resumen.'
    }
  }
}
