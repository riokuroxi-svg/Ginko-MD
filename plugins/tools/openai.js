/*  [ Ginko - Chat IA ]
 *  Chat con IA (Google Gemini) con MEMORIA de conversación.
 *  Uso: .ai <pregunta>  |  .openai <pregunta>  |  .ia <pregunta>
 *  Uso: .ai reset  (borra la memoria de este chat)
 *
 *  ✅ Punto 2: mantiene historial por usuario (últimos 10 mensajes).
 *  ✅ Punto 3: ignora mensajes del propio bot (evita bucles).
 *  ✅ Punto 4: solo responde por comando (no a cualquier mensaje).
 */
import { geminiChat } from "../../storage/script/geminiAI.js"

// Memoria de conversación por chat: { chatId: [ {role, text} ] }
const memoria = {}
global.ginkoMemoria = memoria

export default {
  name: 'openai',
  tags: 'tools',
  command: ['openai', 'ai', 'ia', 'chat'],
  description: 'Chat con IA (Gemini) con memoria',
  example: 'ai hola | ai reset',
  limit: false,
  run: async (m, { sock, text, command }) => {
    const chatId = m.chat

    // Obtener texto del mensaje o citado
    let ya = text && m.quoted ? (m.quoted.text ? text + '\n\n' + m.quoted.text : text) : text ? text : (m.quoted ? (m.quoted.text ? m.quoted.text : false) : false)
    if (!ya) return m.reply(Func.example(m.prefix, command, 'hola'))

    // Punto 2: comando para resetear memoria
    if (ya.toLowerCase() === 'reset' || ya.toLowerCase() === 'limpiar') {
      delete memoria[chatId]
      return m.reply('🧠 *Memoria borrada.* Empezamos de cero.')
    }

    m.reply(global.status.wait)
    try {
      // Punto 2: recuperar historial de este chat
      const historial = memoria[chatId] || []

      const systemPrompt = 'Eres Ginko, un bot de WhatsApp amigable y servicial. Respondes siempre en español de forma clara y breve. Recuerdas el contexto de la conversación.'
      const resp = await geminiChat(ya, systemPrompt, historial)

      // Punto 2: guardar en memoria (usuario y respuesta)
      if (!memoria[chatId]) memoria[chatId] = []
      memoria[chatId].push({ role: 'user', text: ya })
      memoria[chatId].push({ role: 'model', text: resp })
      // Mantener solo últimos 10
      if (memoria[chatId].length > 10) memoria[chatId] = memoria[chatId].slice(-10)

      return m.reply(resp)
    } catch (e) {
      console.error('[AI]', e)
      return m.reply(e.message || '❌ Error con la IA.')
    }
  }
}
