/*  [ Info Command ]
 *  Ginko - Términos y Condiciones
 *  Muestra las normas de uso del bot con botones flotantes, en el estilo de las capturas.
 */
export default {
  name: 'terminos',
  tags: 'main',
  command: ['terminos', 'tyc', 'reglas', 'normas'],
  description: 'Muestra los Términos y Condiciones de uso del bot',
  example: '',
  run: async (m, { sock }) => {
    let teks = `*GINKO AI*\n`
    teks += `ANIME . GAMES . TOOLS\n`
    teks += `*Términos y Condiciones*\n\n`
    teks += `Al interactuar con Ginko, aceptas explícitamente las siguientes normas de uso:\n\n`
    teks += `*1. USO GENERAL*\n`
    teks += `◦ *Uso Responsable:* Prohibido utilizar el bot para realizar spam, ataques de denegación (flood) o cualquier abuso del sistema.\n`
    teks += `◦ *Contenido Ilegal:* Prohibido el uso del bot para promover, difundir o buscar contenido explícito o malicioso.\n`
    teks += `◦ *Límites:* Evita el uso excesivo y concurrente de comandos pesados (ej. descargas).\n\n`
    teks += `*2. SANCIONES*\n`
    teks += `◦ *Bloqueo Temporal:* El sistema puede banearte temporalmente si detecta abuso de comandos repetitivos.\n`
    teks += `◦ *Bloqueo Permanente:* Conductas destructivas o uso para acoso resultarán en Blacklist definitivo.\n\n`
    teks += `El servicio se proporciona "tal cual". Al continuar usando el bot, confirmas que aceptas estas normativas.\n`
    teks += global.set.footer

    // Botones flotantes
    if (sock.sendFooter) {
      await sock.sendFooter(m.chat, global.set.wm, teks, 'Powered By Ginko', m)
    } else {
      m.reply(teks)
    }
  }
}
