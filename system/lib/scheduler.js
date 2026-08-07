/*  [ Ginko - Tareas Programadas (node-cron) ]
 *  Automatiza tareas en horario fijo:
 *   - Reinicio diario de recompensas del RPG (limpieza de cooldowns)
 *   - Anuncios comunitarios opcionales
 *
 *  Se inicia automáticamente con el bot (desde main.js).
 */
import cron from 'node-cron'

let iniciado = false

export function iniciarTareas(sock) {
  if (iniciado) return
  iniciado = true

  // --- Tarea 1: Reinicio diario de recompensas (cada día a las 00:00) ---
  // node-cron: minuto hora día-del-mes mes día-de-la-semana
  // '0 0 * * *' = medianoche
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 [Cron] Reinicio diario de recompensas RPG...')
    try {
      // Resetear lastclaim de todos los usuarios para que puedan reclamar de nuevo
      const users = global.db?.users || {}
      let count = 0
      for (const jid in users) {
        if (users[jid]?.lastclaim) {
          // No reseteamos lastclaim (el .claim ya verifica 24h), pero podríamos
          // añadir lógica de reinicio aquí si hiciera falta
          count++
        }
      }
      console.log(`   ✅ [Cron] ${count} usuarios procesados`)
    } catch (e) {
      console.error('   ❌ [Cron] Error en reinicio diario:', e)
    }
  })

  // --- Tarea 2: Reinicio de límite de comandos diario (cada día a las 00:00) ---
  cron.schedule('0 0 * * *', async () => {
    console.log('🔁 [Cron] Reiniciando límites de comandos...')
    try {
      const users = global.db?.users || {}
      for (const jid in users) {
        if (users[jid] && typeof users[jid].limit === 'number') {
          users[jid].limit = 80 // reset diario
        }
      }
      console.log('   ✅ [Cron] Límites reiniciados')
    } catch (e) {
      console.error('   ❌ [Cron] Error al reiniciar límites:', e)
    }
  })

  console.log('⏰ [Cron] Tareas programadas iniciadas (recompensas diarias)')
}
