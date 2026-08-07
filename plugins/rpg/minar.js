/*  [ Ginko - Minar ]
 *  Mina en busca de dinero/diamantes.
 *  Uso: .minar
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'minar',
  tags: 'rpg',
  command: ['minar', 'mine', 'mineria'],
  description: 'Mina para encontrar dinero',
  example: 'minar',
  rpg: true,
  run: async (m, { sock }) => {
    const user = global.db.users[m.sender]
    const cooldown = 5 * 60 * 1000
    const ahora = Date.now()
    if (user.lastmine && ahora - user.lastmine < cooldown) {
      const restante = Math.ceil((cooldown - (ahora - user.lastmine)) / 60000)
      return m.reply(`⏳ *Espera ${restante} min* para minar de nuevo.`)
    }

    // Posibilidad de encontrar minerales valiosos
    const raro = Math.random() < 0.15
    const ganancia = raro
      ? Math.floor(Math.random() * 20000) + 10000
      : Math.floor(Math.random() * 5000) + 1000

    user.money = (user.money || 0) + ganancia
    user.lastmine = ahora

    const mineral = raro ? '💎 *¡Encontraste un diamante raro!*' : '⛏️ *Minaste dinero normal*'
    m.reply(`${mineral}\n\n> Ganaste *${ganancia.toLocaleString()} 💰*!\n\n> Saldo: ${(user.money||0).toLocaleString()} 💰\n> Vuelve en 5 min`)
  }
}
