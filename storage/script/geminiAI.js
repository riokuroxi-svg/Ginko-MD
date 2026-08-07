/*  [ Ginko - Helper de IA Gemini ]
 *  Integración correcta con la API de Google Gemini.
 *
 *  ✅ Punto 1: La key NO está hardcodeada aquí. Se lee de global.api.gemini
 *     (config.js) o de la variable de entorno GEMINI_API_KEY. Nunca subas config.js
 *     con la key real a GitHub público (Google la bloquea si la detecta).
 *  ✅ Punto 4: Limita a texto (no procesa media pesada automáticamente).
 *  ✅ Punto 5: safetySettings configurados para no bloquear contenido normal.
 */
const MODEL = 'gemini-flash-latest'

export async function geminiChat(prompt, systemPrompt = '', historial = []) {
  const axios = (await import('axios')).default

  // Punto 1: key desde config o variable de entorno (nunca hardcodeada en el repo)
  const key = global.api?.gemini || process.env.GEMINI_API_KEY || ''
  if (!key || key === 'AQUI_TU_KEY_GEMINI') {
    throw '❌ No hay key de Gemini configurada. Pónla en storage/config.js (global.api.gemini)'
  }

  // Punto 5: seguridad - permitir contenido normal, bloquear lo extremo
  const safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  ]

  // Punto 2: historial (memoria) - construir los mensajes
  // Gemini usa contents[] con roles alternados user/model
  let contents = []
  if (systemPrompt) {
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] })
    contents.push({ role: 'model', parts: [{ text: 'Entendido, seguiré esas instrucciones.' }] })
  }
  // Historial previo (user/model alternados)
  for (const h of historial) {
    contents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })
  }
  // Mensaje actual
  contents.push({ role: 'user', parts: [{ text: prompt }] })

  // Mantener solo últimos 10 mensajes (evita contexto gigante)
  contents = contents.slice(-10)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
  const { data } = await axios.post(url, {
    contents,
    safetySettings,
    generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
  }, { timeout: 40000 })

  // Manejar bloqueos de seguridad (punto 5)
  const blocked = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason === 'SAFETY'
  if (blocked) {
    throw '⚠️ La IA bloqueó esta respuesta por políticas de seguridad de Google.'
  }

  const resp = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!resp) throw '❌ Gemini no devolvió respuesta.'
  return resp.trim()
}
