/*  [ Ginko - Casino ]
 *  Juego de casino: apuesta dinero y prueba suerte.
 *  Uso: .casino <cantidad>
 *  Gana: si aciertas, duplicas tu apuesta. Adaptado de Ai-Hoshino.
 */
export default {
  name: 'casino',
  tags: 'rpg',
  command: ['casino', 'apostar'],
  description: 'Juego de casino: apuesta dinero',
  example: 'casino 5000',
  rpg: true,
  run: async (m, { sock, text }) => {
    const user = global.db.users[m.sender]
    const apuesta = parseInt(text)
    if (!apuesta || apuesta < 100) throw `❌ Apuesta mínima: 100. Ej: ${m.prefix}casino 5000`
    if ((user.money || 0) < apuesta) throw `❌ No tienes suficiente dinero (tienes ${(user.money||0).toLocaleString()}).`

    // Retirar apuesta
    user.money -= apuesta

    // Gana o pierde (50%)
    const gano = Math.random() < 0.5
    if (gano) {
      user.money += apuesta * 2
      return m.reply(`🎰 *CASINO*\n\n🎉 ¡Ganaste *${apuesta.toLocaleString()} 💰*!\n\n> Tu saldo: ${(user.money||0).toLocaleString()} 💰`)
    } else {
      return m.reply(`🎰 *CASINO*\n\n😞 Perdiste *${apuesta.toLocaleString()} 💰*...\n\n> Tu saldo: ${(user.money||0).toLocaleString()} 💰\n> Intenta de nuevo con .casino`)
    }
  }
}
