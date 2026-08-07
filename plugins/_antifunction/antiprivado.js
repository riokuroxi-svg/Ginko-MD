/*  [ Ginko - Anti-Private / Anti-Spam DM ]
 *  Si está activado (chat.antiprivado), ignora/bloquea mensajes privados
 *  que NO vengan del owner (evita spam al DM del bot).
 *  Se activa con .on antiprivado  /  se desactiva con .off antiprivado
 */
export async function before(m) {
  if (m.isBaileys || m.fromMe) return true
  if (m.isGroup) return true // solo aplica en chat privado
  if (m.isOwner) return true // el owner siempre puede

  const chat = global.db.chats[m.chat]
  if (chat?.antiprivado) {
    // Ignorar silenciosamente mensajes privados de no-owner (evita spam)
    return false
  }
  return true
}
