/*  [ Ginko - Balance / Cartera ]
 *  Muestra tus recursos (dinero, exp, límite) o los de otro usuario @.
 *  Adaptado del sistema de GataBot (Gata Dios).
 */
export default {
  name: 'balance',
  tags: 'rpg',
  command: ['balance', 'cartera', 'money', 'saldo', 'b'],
  description: 'Ver tu dinero, exp y recursos (o los de @usuario)',
  example: 'balance  o  balance @usuario',
  rpg: true,
  run: async (m, { sock, text }) => {
    // Si se etiquetó a alguien
    let who = m.mentions && m.mentions[0] ? m.mentions[0] : m.sender
    let user = global.db.users[who]
    if (!user) user = global.db.users[m.sender]

    const name = who === m.sender ? m.name : (m.metadata?.participants?.find(p => p.id === who)?.id?.split('@')[0] || 'Usuario')

    let teks = `╭━━━〔 *💰 BALANCE* 〕━━━⬣\n`
    teks += `┃ *Usuario:* @${who.split('@')[0]}\n`
    teks += `┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
    teks += `┃ 💰 *Dinero:* ${(user.money || 0).toLocaleString()}\n`
    teks += `┃ ⚡ *EXP:* ${(user.exp || 0).toLocaleString()}\n`
    teks += `┃ 🎟️ *Límite:* ${user.limit || 0}\n`
    teks += `┃ 🏆 *Nivel:* ${user.level || 0} (${user.role || 'Beginner'})\n`
    teks += `╰━━━━━━━━━━━━━━━━━⬣\n\n`
    teks += `> Para ver los comandos de economía: .menu --economia\n`
    teks += global.set.footer

    m.reply(teks, { mentions: [who] })
  }
}
