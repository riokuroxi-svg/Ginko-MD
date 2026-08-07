/*  [ Ginko - Verificación por Captcha ]
 *  Cuando alguien NUEVO entra al grupo y el captcha está activado,
 *  el bot le exige resolver una operación matemática antes de poder participar.
 *  Si no la resuelve en el tiempo límite, es expulsado.
 *
 *  Activar: .captcha on    Desactivar: .captcha off
 */
let captchaState = {
  pendientes: {},     // jid -> { chat, numero, correcta, textoReto, intentos, timer }
  verificados: {},    // chat -> { [numero]: true }
}

global.captchaState = captchaState

export function generarReto() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  const op = ['+', '-', '×'][Math.floor(Math.random() * 3)]
  let res
  switch (op) {
    case '+': res = a + b; break
    case '-': res = a - b; break
    case '×': res = a * b; break
  }
  return { texto: `${a} ${op} ${b}`, correcta: String(res) }
}

export async function iniciarCaptcha(sock, id, numero) {
  const chat = global.db.chats?.[id]
  if (!chat?.captcha) return false

  const jid = numero.split('@')[0]
  const botNum = global.sock?.user?.id?.split(':')[0]
  if (numero.includes(botNum)) return false

  if (captchaState.pendientes[jid]) {
    clearTimeout(captchaState.pendientes[jid].timer)
    delete captchaState.pendientes[jid]
  }

  const reto = generarReto()
  const esperaMs = 120000

  captchaState.pendientes[jid] = {
    chat: id,
    numero,
    correcta: reto.correcta,
    textoReto: reto.texto,
    intentos: 0,
    timer: null,
  }

  const teks = `🔐 *VERIFICACIÓN ANTIBOT*\n\n`
    + `¡Bienvenido @${jid} al grupo!\n`
    + `Antes de poder participar, resuelve el captcha:\n\n`
    + `> *¿Cuánto es ${reto.texto}?*\n\n`
    + `Responde con el *número*. Tienes *2 minutos*.\n`
    + `> Si no respondes, serás eliminado del grupo.`

  try { await sock.sendMessage(id, { text: teks, mentions: [numero] }) } catch (e) {}

  captchaState.pendientes[jid].timer = setTimeout(async () => {
    const pend = captchaState.pendientes[jid]
    if (pend && pend.chat === id && !captchaState.verificados?.[id]?.[jid]) {
      try { await sock.groupParticipantsUpdate(id, [numero], 'remove') } catch (e) {}
      delete captchaState.pendientes[jid]
    }
  }, esperaMs)

  return true
}

export async function verificarRespuesta(sock, m) {
  const jid = m.sender.split('@')[0]
  const pend = captchaState.pendientes[jid]
  if (!pend || m.chat !== pend.chat) return false

  const respuesta = (m.text || '').trim()
  pend.intentos++

  // Consumir el mensaje del usuario (no debe verse como comando normal)
  if (respuesta === pend.correcta) {
    clearTimeout(pend.timer)
    if (!captchaState.verificados[pend.chat]) captchaState.verificados[pend.chat] = {}
    captchaState.verificados[pend.chat][jid] = true
    delete captchaState.pendientes[jid]
    try { await sock.sendMessage(m.chat, { text: `✅ *¡Verificado!* @${jid} ya puede participar.`, mentions: [m.sender] }) } catch (e) {}
    return true
  }

  if (pend.intentos >= 3) {
    delete captchaState.pendientes[jid]
    try {
      await sock.sendMessage(m.chat, { text: `❌ *Captcha fallido.* @${jid} no respondió correctamente y será eliminado.`, mentions: [m.sender] })
      await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    } catch (e) {}
    return true
  }

  try {
    await sock.sendMessage(m.chat, { text: `❌ *Incorrecto* (@${jid}). Intento ${pend.intentos}/3.\n\n> *¿Cuánto es ${pend.textoReto}?*`, mentions: [m.sender] })
  } catch (e) {}
  return true
}

export default {
  name: 'captcha',
  tags: 'group',
  command: ['captcha'],
  description: 'Activa/desactiva verificación por captcha para nuevos miembros',
  example: 'captcha on/off',
  group: true,
  botAdmin: true,
  run: async (m, { text }) => {
    const flag = (text || '').toLowerCase().trim()
    if (!['on', 'off'].includes(flag)) return m.reply(`Uso: ${m.prefix}captcha on|off`)
    global.db.chats[m.chat].captcha = flag === 'on'
    m.reply(`✅ *Captcha* ${flag === 'on' ? 'activado' : 'desactivado'} en este grupo.`)
  }
}
