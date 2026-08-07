/*  [ Ginko - Chat Anónimo ]
 *  Conecta a 2 usuarios aleatorios en un chat anónimo.
 *  .anon  → buscar pareja
 *  .salir → salir del chat anónimo
 *  También responde a .next / .siguiente para buscar otra persona.
 */
let chatAnon = {
  sala: {},          // userA -> userB
  espera: [],        // usuarios esperando
}
global.chatAnon = chatAnon // accesible desde el handler

export default {
  name: 'anonimo',
  tags: 'tools',
  command: ['anon', 'anonymous', 'anonimo', 'chatanon'],
  description: 'Chat anónimo con una persona aleatoria',
  example: 'anon',
  run: async (m, { sock, text }) => {
    const user = m.sender

    // Comandos de control
    const lower = (text || '').toLowerCase()
    if (lower.includes('salir') || lower.includes('exit') || lower.includes('next') || lower.includes('siguiente')) {
      const pareja = chatAnon.sala[user]
      if (pareja) {
        delete chatAnon.sala[pareja]
        delete chatAnon.sala[user]
        try { sock.sendMessage(pareja, { text: '🫥 Tu pareja abandonó el chat anónimo. Usa .anon para buscar otra.' }) } catch (e) {}
        chatAnon.espera = chatAnon.espera.filter(x => x !== user && x !== pareja)
        return m.reply('👋 Saliste del chat anónimo.')
      }
      chatAnon.espera = chatAnon.espera.filter(x => x !== user)
      return m.reply('👋 Ya no estás en la lista de espera.')
    }

    // Ya tiene pareja
    if (chatAnon.sala[user]) {
      const pareja = chatAnon.sala[user]
      return m.reply(`💬 Ya estás en un chat anónimo.\n\nEscribe directo para enviar tu mensaje.\n> Para salir: *${m.prefix}anon salir*`)
    }

    // Buscar pareja en espera
    let pareja = chatAnon.espera.find(x => x !== user)
    if (pareja) {
      chatAnon.espera = chatAnon.espera.filter(x => x !== pareja)
      chatAnon.sala[user] = pareja
      chatAnon.sala[pareja] = user
      sock.sendMessage(user, { text: '🎉 ¡Encontraste pareja! Hablen con confianza.\n> Para salir: .anon salir' })
      return sock.sendMessage(pareja, { text: '🎉 ¡Encontraste pareja! Hablen con confianza.\n> Para salir: .anon salir' })
    }

    // Esperando
    if (!chatAnon.espera.includes(user)) chatAnon.espera.push(user)
    m.reply('⏳ Esperando pareja... Cuando alguien use `.anon` se conectarán. Para cancelar: `.anon salir`')
  }
}

// Redirigir mensajes privados entre parejas anónimas
// Retorna true si el mensaje se consumió (no debe procesarse como comando).
export async function anonymousRedirect(sock, m) {
  const chatAnon = global.chatAnon || { sala: {}, espera: [] }
  const user = m.sender
  const pareja = chatAnon.sala[user]
  if (pareja && !m.isCommand) {
    // Solo reenviamos mensajes de texto
    const txt = m.text || m.body || m.msg?.conversation || ''
    if (txt && !txt.startsWith('.')) {
      await sock.sendMessage(pareja, { text: txt })
      return true
    }
  }
  return false
}
