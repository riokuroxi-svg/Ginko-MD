/*  [ Ginko - Crimen ]
 *  Comete un delito para ganar mucho dinero (con riesgo de fracasar y ser atrapado).
 *  Uso: .crimen
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'crimen',
  tags: 'rpg',
  command: ['crimen', 'crime', 'robar'],
  description: 'Comete un crimen por dinero (riesgoso)',
  example: 'crimen',
  rpg: true,
  run: async (m, { sock }) => {
    const user = global.db.users[m.sender]
    const cooldown = 10 * 60 * 1000 // 10 min
    const ahora = Date.now()
    if (user.lastcrime && ahora - user.lastcrime < cooldown) {
      const restante = Math.ceil((cooldown - (ahora - user.lastcrime)) / 60000)
      return m.reply(`⏳ *Espera ${restante} min* para cometer otro crimen.`)
    }

    // 40% de éxito, 60% fracaso
    const exito = Math.random() < 0.4
    user.lastcrime = ahora

    if (exito) {
      const ganancia = Math.floor(Math.random() * 20000) + 5000
      user.money = (user.money || 0) + ganancia
      return m.reply(`🦹 *CRIMEN EXITOSO*\n\n> Robaste *${ganancia.toLocaleString()} 💰* sin ser atrapado!\n\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    } else {
      // Fracaso: pierde algo de dinero
      const perdida = Math.floor(Math.random() * 5000) + 500
      user.money = Math.max(0, (user.money || 0) - perdida)
      return m.reply(`🚔 *¡TE ATRAPARON!*\n\n> La policía te atrapó y pagaste *${perdida.toLocaleString()} 💰* de multa.\n\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    }
  }
}
