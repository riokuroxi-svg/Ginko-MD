/*  [ Ginko - Duelo / PvP con apuesta ]
 *  Reta a otro usuario (etiquetándolo) a un duelo apostando dinero.
 *  Adaptado del sistema de duelo de bots RPG tipo Gata Dios.
 *
 *  Uso:
 *   .duelo @usuario <cantidad>   → retas a alguien apostando X dinero
 *   .aceptar                     → el retado acepta el duelo
 *   .rechazar                    → el retado rechaza
 *
 *  Cuando ambos confirman, se sortea el ganador y se transfiere la apuesta.
 */
let duelos = {}

export default {
  name: 'duelo',
  tags: 'rpg',
  command: ['duelo', 'pvp', 'pelear', 'batalla'],
  description: 'Retar a @usuario a un duelo apostando dinero',
  example: 'duelo @usuario 5000',
  rpg: true,
  run: async (m, { sock, command, text }) => {
    // Aceptar duelo pendiente
    if (command === 'aceptar' || (text || '').toLowerCase() === 'aceptar') {
      const reto = Object.values(duelos).find(d => d.retado === m.sender && d.estado === 'pendiente')
      if (!reto) return m.reply('❌ No tienes ningún duelo pendiente.')
      return aceptarDuelo(sock, m, reto)
    }

    // Rechazar
    if (command === 'rechazar' || (text || '').toLowerCase() === 'rechazar') {
      const reto = Object.values(duelos).find(d => d.retado === m.sender && d.estado === 'pendiente')
      if (!reto) return m.reply('❌ No tienes ningún duelo pendiente.')
      delete duelos[reto.id]
      return m.reply('❌ *Duelo rechazado.*')
    }

    // Crear duelo
    if (!text) return m.reply(Func.example(m.prefix, command, '@usuario 5000'))
    const who = m.mentions && m.mentions[0]
    const cantidad = parseInt(text.replace(/[^0-9]/g, ''))
    if (!who || who === m.sender) return m.reply('❌ Etiqueta a tu oponente.')
    if (!cantidad || cantidad < 100) return m.reply('❌ La apuesta mínima es 100.')
    if ((global.db.users[m.sender].money || 0) < cantidad) return m.reply('❌ No tienes suficiente dinero para apostar.')

    // Verificar que el retado tenga dinero
    const retadoUser = global.db.users[who]
    if (!retadoUser) return m.reply('❌ El usuario no está registrado.')
    if ((retadoUser.money || 0) < cantidad) return m.reply('❌ Tu oponente no tiene suficiente dinero para aceptar esa apuesta.')

    // Crear el reto
    const id = Date.now()
    duelos[id] = { id, retador: m.sender, retado: who, cantidad, estado: 'pendiente' }
    setTimeout(() => { if (duelos[id]?.estado === 'pendiente') delete duelos[id] }, 60000)

    m.reply(`⚔️ *DUELO PROPUESTO*\n\n> @${who.split('@')[0]} ha sido retado por @${m.sender.split('@')[0]}\n> Apuesta: *${cantidad.toLocaleString()} 💰*\n\n> @${who.split('@')[0]} responde: .aceptar  o  .rechazar\n> (expira en 60s)`, { mentions: [who, m.sender] })
  }
}

async function aceptarDuelo(sock, m, reto) {
  const { retador, retado, cantidad, id } = reto
  const retadorUser = global.db.users[retador]
  const retadoUser = global.db.users[retado]

  // Verificar fondos de ambos
  if ((retadorUser.money || 0) < cantidad || (retadoUser.money || 0) < cantidad) {
    delete duelos[id]
    return m.reply('❌ Alguien no tiene suficiente dinero. Duelo cancelado.')
  }

  // Ejecutar: retirar apuestas de ambos
  retadorUser.money -= cantidad
  retadoUser.money -= cantidad

  // Sortear ganador
  const ganaRetador = Math.random() < 0.5
  const ganador = ganaRetador ? retador : retado
  const perdedor = ganaRetador ? retado : retador
  const ganadorUser = ganaRetador ? retadorUser : retadoUser
  ganadorUser.money += cantidad * 2 // gana las 2 apuestas

  delete duelos[id]

  m.reply(`⚔️ *¡DUELO TERMINADO!*\n\n> 🏆 *@${ganador.split('@')[0]} GANA* y se lleva *${(cantidad * 2).toLocaleString()} 💰*\n> 💀 @${perdedor.split('@')[0]} pierde *${cantidad.toLocaleString()}*\n\n> Ver balances con .balance`, { mentions: [ganador, perdedor] })
}
