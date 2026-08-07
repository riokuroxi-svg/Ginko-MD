/*  [ Ginko - Coinflip / Cara o Cruz ]
 *  Juego de cara o cruz apostando dinero.
 *  Uso: .coinflip <cara|cruz> <cantidad>
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'coinflip',
  tags: 'rpg',
  command: ['coinflip', 'caraocruz', 'flip'],
  description: 'Cara o cruz apostando dinero',
  example: 'coinflip cara 5000',
  rpg: true,
  run: async (m, { sock, text }) => {
    const partes = text.trim().split(/\s+/)
    const eleccion = (partes[0] || '').toLowerCase()
    const apuesta = parseInt(partes[1])
    if (!['cara', 'cruz'].includes(eleccion)) throw `❌ Elige *cara* o *cruz*. Ej: ${m.prefix}coinflip cara 5000`
    if (!apuesta || apuesta < 100) throw `❌ Apuesta mínima: 100.`

    const user = global.db.users[m.sender]
    if ((user.money || 0) < apuesta) throw `❌ No tienes suficiente dinero (tienes ${(user.money||0).toLocaleString()}).`

    const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    user.money -= apuesta

    if (eleccion === resultado) {
      user.money += apuesta * 2
      return m.reply(`🪙 *CARA O CRUZ*\n\n> Salio: *${resultado}*\n> Tu elección: *${eleccion}*\n\n🎉 ¡Ganaste *${apuesta.toLocaleString()} 💰*!\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    } else {
      return m.reply(`🪙 *CARA O CRUZ*\n\n> Salio: *${resultado}*\n> Tu elección: *${eleccion}*\n\n😞 Perdiste *${apuesta.toLocaleString()} 💰*\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    }
  }
}
