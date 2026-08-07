/*  [ Ginko - Entretenimiento ]
 *  Comandos rápidos de entretenimiento: chistes, datos curiosos, consejos.
 *  Uso: .chiste | .dato | .consejo
 */
export default {
  name: 'entretenimiento',
  tags: 'tools',
  command: ['chiste', 'dato', 'datointeresante', 'consejo'],
  description: 'Chistes, datos curiosos y consejos',
  example: 'chiste | dato | consejo',
  tools: true,
  run: async (m, { sock, command }) => {
    // CHISTES
    if (command === 'chiste') {
      const chistes = [
        "¿Qué le dice un jaguar a otro jaguar? ¡Jaguar you! 🐆😂",
        "¿Por qué el libro de matemáticas está triste? Porque tiene demasiados problemas. 📚😢",
        "Mi jefe me dijo que fuera creativo... ahora soy un pez 🐠",
        "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 🐝💃",
        "Llamé a la NASA y me dijeron que la Tierra gira... ¡yo ya lo sabía, estoy mareado! 🌍🤢",
        "¿Cómo se despiden los químicos? Ácido un placer. 🧪😄",
        "Los ordenadores se van de fiesta... ¡a bailar en la red! 💻🎉",
        "¿Qué le dice un semáforo a otro? No me mires, me estoy cambiando. 🚦"
      ]
      const c = chistes[Math.floor(Math.random() * chistes.length)]
      return m.reply(`😂 *CHISTE*\n\n> ${c}`)
    }

    // DATOS CURIOSOS
    if (command === 'dato' || command === 'datointeresante') {
      const datos = [
        "🐙 Los pulpos tienen 3 corazones y sangre azul.",
        "🍌 Las bananas son ligeramente radiactivas.",
        "🐜 Las hormigas pueden levantar hasta 50 veces su propio peso.",
        "🌍 La Tierra es el único planeta conocido que no lleva nombre de un dios.",
        "🧠 Tu cerebro usa el 20% de la energía total de tu cuerpo.",
        "🦒 Las jirafas no tienen cuerdas vocales.",
        "💧 El agua caliente se congela más rápido que el agua fría (efecto Mpemba).",
        "🦉 Las lechuzas no pueden mover sus ojos, giran la cabeza.",
        "🍫 Se necesitan unos 400 granos de cacao para hacer medio kilo de chocolate.",
        "🐳 La ballena azul puede pesar tanto como 30 elefantes."
      ]
      const d = datos[Math.floor(Math.random() * datos.length)]
      return m.reply(`🤓 *DATO CURIOSO*\n\n> ${d}`)
    }

    // CONSEJOS
    if (command === 'consejo') {
      const consejos = [
        "💧 Toma agua antes de sentir sed.",
        "😴 Dormir 7-8 horas mejora tu memoria y ánimo.",
        "📱 Toma descansos de la pantalla cada 20 min.",
        "🏃 Caminar 30 min al día hace una gran diferencia.",
        "🙏 Agradece algo cada día: mejora tu estado de ánimo.",
        "🥦 Come más vegetales y menos comida procesada.",
        "🧘 Respira profundo cuando estés estresado.",
        "📚 Lee 10 páginas al día: en un año son 20 libros."
      ]
      const c = consejos[Math.floor(Math.random() * consejos.length)]
      return m.reply(`💡 *CONSEJO*\n\n> ${c}`)
    }
  }
}
