/*  [ Ginko - Aceptar / Rechazar duelo ]
 *  El retado responde .aceptar o .rechazar a un duelo pendiente.
 *  La lógica está en duelo.js (plugin con comando 'aceptar'/'rechazar'),
 *  así que aquí simplemente redirigimos para que el comando esté disponible.
 */
export default {
  name: 'aceptar',
  tags: 'rpg',
  command: ['aceptar', 'rechazar'],
  description: 'Acepta o rechaza un duelo pendiente',
  example: 'aceptar  |  rechazar',
  rpg: true,
  run: async (m, { sock, command }) => {
    // Delegar al plugin de duelo
    const dueloMod = await import('./duelo.js').catch(() => null)
    if (dueloMod?.default) {
      return dueloMod.default.run(m, { sock, command, text: command })
    }
    m.reply('❌ No hay duelo disponible.')
  }
}
