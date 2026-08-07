/*  [ Ginko - Menú de Grupo ]
 *  Menú específico para administradores de grupo: muestra los comandos de
 *  moderación y cómo activar funciones de seguridad.
 *  Uso: .menugrupo  |  .gm  |  .menugrupos
 */
export default {
  name: 'menugrupo',
  tags: 'main',
  command: ['menugrupo', 'gm', 'mgrupo'],
  description: 'Menú de comandos para grupos (moderación y seguridad)',
  example: 'menugrupo',
  group: true,
  run: async (m, { sock }) => {
    let teks = `👥 *MENÚ DE GRUPO - GINKO*\n\n`
    teks += `> Herramientas de moderación y seguridad para tu grupo.\n\n`

    teks += `*📌 COMANDOS DE ADMIN*\n`
    teks += `▸ ${m.prefix}kick @usuario — elimina a un miembro\n`
    teks += `▸ ${m.prefix}add <número> — agrega un miembro\n`
    teks += `▸ ${m.prefix}tagall — etiqueta a todos\n`
    teks += `▸ ${m.prefix}hidetag — menciona a todos sin texto\n`
    teks += `▸ ${m.prefix}setdescgc — cambia la descripción\n`
    teks += `▸ ${m.prefix}linkgroup — obtiene el enlace del grupo\n`
    teks += `▸ ${m.prefix}delete — borra un mensaje\n\n`

    teks += `*🛡️ SEGURIDAD (actívalas con .on o .captcha)*\n`
    teks += `▸ ${m.prefix}captcha on — verificación anti-bot al entrar\n`
    teks += `▸ ${m.prefix}on antilink — bloquea enlaces de otros grupos\n`
    teks += `▸ ${m.prefix}on antispam — bloquea spam\n`
    teks += `▸ ${m.prefix}on antiprivado — ignora mensajes privados de extraños\n`
    teks += `▸ ${m.prefix}on antiinternacional — bloquea números de otros países\n\n`

    teks += `*⚙️ FUNCIONES DEL GRUPO*\n`
    teks += `▸ ${m.prefix}welcome on — activa la bienvenida\n`
    teks += `▸ ${m.prefix}linkgroup — enlace del grupo\n`
    teks += `▸ ${m.prefix}gpinfo — información del grupo\n\n`

    teks += `*ℹ️ Nota:* El bot debe ser *admin* del grupo para los comandos de moderación.\n`
    teks += `> Usa ${m.prefix}on <flag> y ${m.prefix}off <flag> para activar/desactivar funciones.\n`
    teks += global.set.footer

    m.reply(teks)
  }
}
