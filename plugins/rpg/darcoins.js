/*  [ Ginko - Dar dinero / Dar coins ]
 *  Regala dinero a otro usuario @.
 *  Uso: .darcoins <cantidad> @usuario
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'darcoins',
  tags: 'rpg',
  command: ['darcoins', 'dar', 'regalar', 'darxp'],
  description: 'Regala dinero a otro usuario @',
  example: 'darcoins 5000 @usuario',
  rpg: true,
  run: async (m, { sock, text, command }) => {
    if (!text) throw `❌ Uso: ${m.prefix}darcoins <cantidad> @usuario`

    const partes = text.trim().split(/\s+/)
    const cantidad = parseInt(partes[0])
    const who = m.mentions && m.mentions[0]

    if (!cantidad || cantidad < 1) throw '❌ Cantidad inválida.'
    if (!who || who === m.sender) throw '❌ Etiqueta al usuario que recibirá el dinero.'

    const user = global.db.users[m.sender]
    const destino = global.db.users[who]
    if (!destino) throw '❌ El usuario no está registrado.'
    if ((user.money || 0) < cantidad) throw `❌ No tienes suficiente dinero (tienes ${(user.money||0).toLocaleString()}).`

    user.money -= cantidad
    destino.money = (destino.money || 0) + cantidad

    m.reply(`🎁 *DONACIÓN*\n\n> @${who.split('@')[0]} recibió *${cantidad.toLocaleString()} 💰* de @${m.sender.split('@')[0]}\n\n> Tu saldo: ${(user.money||0).toLocaleString()} 💰`, { mentions: [who, m.sender] })
  }
}
