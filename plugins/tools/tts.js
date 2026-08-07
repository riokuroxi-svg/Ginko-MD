/*  [ Ginko - Texto a Voz (TTS) ]
 *  Convierte texto en audio.
 *  Uso: .tts <texto>
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'tts',
  tags: 'tools',
  command: ['tts', 'textovoz'],
  description: 'Convierte texto en voz (audio)',
  example: 'tts hola mundo',
  tools: true,
  run: async (m, { sock, text }) => {
    if (!text) throw `❌ Escribe el texto. Ej: ${m.prefix}tts hola mundo`
    m.reply('🔊 *Generando audio...*')
    try {
      const lang = 'es'
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.slice(0, 200))}&tl=${lang}&client=tw-ob`
      await sock.sendMessage(m.chat, { audio: { url: audioUrl, mimetype: 'audio/mp4' }, ptt: false }, { quoted: m })
    } catch (e) {
      console.error('[TTS]', e)
      throw '❌ No pude generar el audio. Intenta de nuevo.'
    }
  }
}
