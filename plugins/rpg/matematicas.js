/*  [ Ginko - Juego de Matemáticas ]
 *  Resuelve la operación matemática y gana dinero.
 *  Uso: .math  (el bot da una operación)
 *  Adaptado de Ai-Hoshino.
 */
let retos = {}
global.mathRetos = retos

export default {
  name: 'math',
  tags: 'rpg',
  command: ['math', 'mates', 'matematicas'],
  description: 'Resuelve la operación y gana dinero',
  example: 'math',
  rpg: true,
  run: async (m, { sock }) => {
    // Si es la respuesta a un reto pendiente
    const jid = m.sender.split('@')[0]
    if (retos[jid]) return responder(sock, m, jid)

    // Crear nuevo reto
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const op = ['+', '-', '×'][Math.floor(Math.random() * 3)]
    let res
    switch (op) {
      case '+': res = a + b; break
      case '-': res = a - b; break
      case '×': res = a * b; break
    }
    retos[jid] = { chat: m.chat, respuesta: String(res), intentos: 0 }
    setTimeout(() => { delete retos[jid] }, 30000)

    m.reply(`🧮 *JUEGO DE MATEMÁTICAS*\n\n> ¿Cuánto es *${a} ${op} ${b}*?\n\n> Responde con *${m.prefix}math <resultado>*\n> (tienes 30s, premio: *5,000 💰*)`)
  }
}

async function responder(sock, m, jid) {
  const reto = retos[jid]
  if (m.chat !== reto.chat) return
  const respuesta = (m.text || '').replace(m.prefix, '').replace(/math|mates|matematicas/i, '').trim()
  reto.intentos++
  const user = global.db.users[m.sender]

  if (respuesta === reto.respuesta) {
    user.money = (user.money || 0) + 5000
    delete retos[jid]
    return m.reply(`🧮 *¡CORRECTO!* 🎉\n\n> Ganaste *5,000 💰*\n> Saldo: ${(user.money||0).toLocaleString()} 💰`)
  }

  if (reto.intentos >= 3) {
    delete retos[jid]
    return m.reply(`❌ *Fin del juego.* La respuesta era: *${reto.respuesta}*\n> Para jugar de nuevo: .math`)
  }

  return m.reply(`❌ *Incorrecto* (intento ${reto.intentos}/3). Intenta de nuevo con ${m.prefix}math <resultado>`)
}
