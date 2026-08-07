/*  [ Ginko - Piedra, Papel o Tijera ]
 *  Juego de PPT apostando dinero contra el bot.
 *  Uso: .ppt <piedra|papel|tijera> <cantidad>
 *  Adaptado de Ai-Hoshino.
 */
export default {
  name: 'ppt',
  tags: 'rpg',
  command: ['ppt', 'pptgame', 'piedrapapeltijera'],
  description: 'Piedra, papel o tijera apostando dinero',
  example: 'ppt piedra 5000',
  rpg: true,
  run: async (m, { sock, text }) => {
    const partes = text.trim().split(/\s+/)
    const eleccion = (partes[0] || '').toLowerCase()
    const apuesta = parseInt(partes[1])
    if (!['piedra', 'papel', 'tijera'].includes(eleccion)) throw `❌ Elige *piedra*, *papel* o *tijera*. Ej: ${m.prefix}ppt piedra 5000`
    if (!apuesta || apuesta < 100) throw `❌ Apuesta mínima: 100.`

    const user = global.db.users[m.sender]
    if ((user.money || 0) < apuesta) throw `❌ No tienes suficiente dinero (tienes ${(user.money||0).toLocaleString()}).`

    const opciones = ['piedra', 'papel', 'tijera']
    const bot = opciones[Math.floor(Math.random() * 3)]

    // Reglas: piedra>tijera, tijera>papel, papel>piedra
    let resultado
    if (eleccion === bot) resultado = 'empate'
    else if (
      (eleccion === 'piedra' && bot === 'tijera') ||
      (eleccion === 'tijera' && bot === 'papel') ||
      (eleccion === 'papel' && bot === 'piedra')
    ) resultado = 'gana'
    else resultado = 'pierde'

    let msg = `✂️ *PIEDRA, PAPEL O TIJERA*\n\n> Tú: *${eleccion}*\n> Bot: *${bot}*\n\n`
    if (resultado === 'empate') {
      return m.reply(msg + `🤝 *¡Empate!* Recuperas tu apuesta.\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    } else if (resultado === 'gana') {
      user.money += apuesta * 2
      return m.reply(msg + `🎉 *¡Ganaste *${apuesta.toLocaleString()} 💰*!\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    } else {
      user.money -= apuesta
      return m.reply(msg + `😞 *Perdiste* ${apuesta.toLocaleString()} 💰\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
    }
  }
}
