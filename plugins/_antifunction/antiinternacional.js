/*  [ Ginko - Anti-Internacional ]
 *  Si está activado (chat.antiinternacional), elimina/ignora mensajes de números
 *  cuyo código de país no coincide con el del bot (anti-spam internacional).
 *  Se activa con: .on antiinternacional
 */
import { parsePhoneNumber } from "libphonenumber-js"

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys || m.fromMe) return true
  if (!m.isGroup) return true
  if (m.isAdmin) return true

  const chat = global.db.chats[m.chat]
  if (!chat?.antiinternacional) return true

  // Número del bot (país local)
  const botNumber = global.sock?.user?.id?.split(':')[0] || ''
  const botCountry = botNumber.slice(0, 1) // primer dígito como aproximación simple

  // Número del remitente
  const senderNum = m.sender.replace('@s.whatsapp.net', '')
  let senderCountry = null
  try {
    const parsed = parsePhoneNumber('+' + senderNum)
    senderCountry = parsed?.countryCallingCode
  } catch (e) {
    senderCountry = senderNum.slice(0, 1)
  }

  const botCountryCode = botNumber.length > 0 ? botNumber.slice(0, botNumber.length - 8) : null

  // Lógica simple: si el prefijo del remitente difiere del bot, bloquear
  // (adaptable; aquí usamos el prefijo de país)
  const botPrefix = senderNum.length > 0 && botNumber ? botNumber.slice(0, senderNum.length - 10) : null
  if (botPrefix && senderNum.startsWith(botPrefix)) return true // mismo país

  // Diferente país -> bloquear
  if (isBotAdmin) {
    try { this.sendMessage(m.chat, { delete: m.key }) } catch (e) {}
  }
  m.reply('🚫 *Anti-Internacional:* Los números de otros países están bloqueados en este grupo.')
  return false
}
