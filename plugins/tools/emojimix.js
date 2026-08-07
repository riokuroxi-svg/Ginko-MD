/*  [ Ginko - Emoji Mix ]
 *  Combina 2 emojis en uno solo (imagen).
 *  Uso: .emojimix <emoji1><emoji2>
 *  Ej: .emojimix 😱😨
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'emojimix',
  tags: 'tools',
  command: ['emojimix', 'emix', 'emoji'],
  description: 'Combina 2 emojis en una imagen',
  example: 'emojimix 😱😨',
  tools: true,
  run: async (m, { sock, text }) => {
    if (!text) throw `❌ Uso: ${m.prefix}emojimix 😱😨`
    // Extraer 2 emojis del texto
    const emojis = text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu)
    if (!emojis || emojis.length < 2) throw '❌ Necesitas 2 emojis. Ej: .emojimix 😱😨'

    m.reply('🎨 *Combinando emojis...*')
    try {
      const url = `https://emojik.vercel.app/s/${emojis[0]}_${emojis[1]}`
      await sock.sendMessage(m.chat, { image: { url }, caption: `🎨 *Emoji Mix:* ${emojis[0]} + ${emojis[1]}\n\n${global.set.footer}` }, { quoted: m })
    } catch (e) {
      console.error('[EmojiMix]', e)
      throw '❌ No pude combinar esos emojis.'
    }
  }
}
