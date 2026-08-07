/*  [ Ginko - Trabajar ]
 *  Trabaja para ganar dinero (con cooldown).
 *  Uso: .trabajar
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'trabajar',
  tags: 'rpg',
  command: ['trabajar', 'work', 'trabajo'],
  description: 'Trabaja para ganar dinero',
  example: 'trabajar',
  rpg: true,
  run: async (m, { sock }) => {
    const user = global.db.users[m.sender]
    const cooldown = 5 * 60 * 1000 // 5 min
    const ahora = Date.now()
    if (user.lastwork && ahora - user.lastwork < cooldown) {
      const restante = Math.ceil((cooldown - (ahora - user.lastwork)) / 60000)
      return m.reply(`⏳ *Espera ${restante} min* para trabajar de nuevo.`)
    }

    // Ganancias aleatorias
    const ganancia = Math.floor(Math.random() * 8000) + 2000
    const trabajos = ['repartidor', 'cocinero', 'programador', 'taxista', 'mesero', 'cajero']
    const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)]

    user.money = (user.money || 0) + ganancia
    user.lastwork = ahora

    m.reply(`💼 *TRABAJO*\n\n> Trabajaste como *${trabajo}* y ganaste *${ganancia.toLocaleString()} 💰*!\n\n> Saldo: ${(user.money||0).toLocaleString()} 💰\n> Vuelve en 5 min con .trabajar`)
  }
}
