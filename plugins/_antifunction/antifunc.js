/*  [ Ginko - Anti-Flood / Anti-Spam ]
 *  Detección automática de abuso de comandos repetitivos.
 *  Si un usuario envía más de `max` comandos en `ventana` segundos, se le avisa
 *  y se ignora temporalmente (bloqueo temporal, como en las sanciones).
 *
 *  Se integra en el handler vía `global.checkFlood`. Devuelve `true` si debe
 *  bloquear el mensaje (el comando no se ejecuta).
 */
const ventana = 8            // segundos
const maxComandos = 6        // comandos permitidos en la ventana
const castigoMs = 30 * 1000  // 30 segundos de espera

const historial = {} // sender -> { timestamps[], bannedUntil }

export function checkFlood(m) {
  if (!m.isCommand) return false
  const sender = m.sender
  const ahora = Date.now()

  if (!historial[sender]) historial[sender] = { timestamps: [] }

  const h = historial[sender]

  // Limpiar timestamps fuera de la ventana
  h.timestamps = h.timestamps.filter(t => ahora - t < ventana * 1000)

  // ¿Está en castigo?
  if (h.bannedUntil && ahora < h.bannedUntil) {
    return true // bloquear
  }

  h.timestamps.push(ahora)

  // Superó el umbral -> castigo temporal
  if (h.timestamps.length >= maxComandos) {
    h.bannedUntil = ahora + castigoMs
    h.timestamps = h.timestamps.filter(t => ahora - t < ventana * 1000)
    try {
      m.reply('⚠️ *Anti-Flood:* Has enviado demasiados comandos muy rápido. Espera un momento antes de continuar.')
    } catch (e) {}
    return true // bloquear
  }

  return false // permitir
}

export default {
  // Plugin vacío (solo para registrar la carpeta/plugin); la lógica la usa el handler.
  name: 'antiflood',
  tags: '_antifunction',
}
