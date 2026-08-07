/*  [ Ginko - on / off ]
 *  Activa o desactiva funciones del bot en el grupo/chat.
 *  Uso: .on <flag>  /  .off <flag>
 *  Flags: antilink, antispam, antiprivado, antiinternacional, antifoto, antivideo, antiaudio
 */
export default {
  name: 'on/off',
  tags: 'owner',
  command: ['on', 'off', 'enable', 'disable'],
  description: 'Activa o desactiva funciones (on/off)',
  example: 'on antispam',
  owner: true,
  run: async (m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'antilink'))
    const flag = text.toLowerCase().trim()
    const val = command === 'on' || command === 'enable'

    // Flags válidos
    const flags = ['antilink', 'antispam', 'antiprivado', 'antiinternacional', 'antifoto', 'antivideo', 'antiaudio', 'antitoxic', 'nsfw', 'welcome', 'simi']
    if (!flags.includes(flag)) {
      return m.reply(`❌ Flag no válido. Disponibles: ${flags.join(', ')}`)
    }

    if (m.isGroup) {
      global.db.chats[m.chat][flag] = val
      m.reply(`✅ *${flag}* ${val ? 'activado' : 'desactivado'} en este grupo.`)
    } else {
      global.db.settings[flag] = val
      m.reply(`✅ *${flag}* ${val ? 'activado' : 'desactivado'} globalmente.`)
    }
  }
}
