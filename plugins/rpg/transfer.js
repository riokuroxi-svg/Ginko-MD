/*  [ Ginko - Transferir Recursos @ ]
 *  Transfiere dinero/exp/límite a otro usuario etiquetándolo.
 *  Adaptado del sistema de transferencia de GataBot (Gata Dios).
 *  Uso: .transfer <tipo> <cantidad> @usuario
 *  Ej:  .transfer money 5000 @593...
 *  Tipos: money, exp, limit
 */
let confirmaciones = {}

export default {
  name: 'transfer',
  tags: 'rpg',
  command: ['transfer', 'transferir', 'enviar'],
  description: 'Transfiere dinero/exp/límite a otro usuario @',
  example: 'transfer money 5000 @usuario',
  rpg: true,
  run: async (m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'money 5000 @usuario'))

    const partes = text.trim().split(/\s+/)
    const tipo = (partes[0] || '').toLowerCase()
    const cantidad = parseInt(partes[1])
    const who = m.mentions && m.mentions[0] ? m.mentions[0] : (partes[2] ? partes[2].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : '')

    // Validaciones
    const tiposValidos = { money: '💰 Dinero', exp: '⚡ EXP', limit: '🎟️ Límite' }
    if (!tiposValidos[tipo]) return m.reply(`❌ Tipo inválido. Usa: money, exp, limit\nEj: ${m.prefix}transfer money 5000 @usuario`)
    if (!cantidad || cantidad < 1) return m.reply('❌ Cantidad inválida.')
    if (!who || who === m.sender) return m.reply('❌ Etiqueta al usuario a quien quieres enviar.')

    const usuario = global.db.users[m.sender]
    const destino = global.db.users[who]
    if (!destino) return m.reply('❌ El usuario no está registrado en la base de datos.')

    // Verificar fondos
    if ((usuario[tipo] || 0) < cantidad) return m.reply(`❌ No tienes suficiente ${tiposValidos[tipo]} (tienes ${usuario[tipo] || 0}).`)

    // Confirmación (la segunda vez que escribes el mismo comando, confirma)
    if (confirmaciones[m.sender] && confirmaciones[m.sender].who === who && confirmaciones[m.sender].tipo === tipo && confirmaciones[m.sender].cantidad === cantidad) {
      // Ejecutar
      usuario[tipo] -= cantidad
      destino[tipo] = (destino[tipo] || 0) + cantidad
      delete confirmaciones[m.sender]
      return m.reply(`✅ *Transferencia realizada*\n\n> ${cantidad} ${tiposValidos[tipo]} → @${who.split('@')[0]}`, { mentions: [who] })
    }

    // Primera vez: pedir confirmación
    confirmaciones[m.sender] = { who, tipo, cantidad }
    setTimeout(() => { delete confirmaciones[m.sender] }, 30000)
    m.reply(`⚠️ *Confirmar transferencia*\n\n> Enviar *${cantidad} ${tiposValidos[tipo]}* a @${who.split('@')[0]}?\n\n> Escribe el MISMO comando de nuevo para confirmar.\n> (se cancela en 30s)`, { mentions: [who] })
  }
}
