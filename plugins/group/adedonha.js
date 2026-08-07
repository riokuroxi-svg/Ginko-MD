/*  [ Ginko - Adedonha / Stop ]
 *  Juego de palabras (de Brasil): el bot da una letra y un tema.
 *  Cada jugador debe responder con una palabra que empiece con esa letra
 *  dentro del tema indicado.
 *  Uso: .stop   (el bot elige letra + tema al azar)
 */
const temas = ['animal', 'país', 'comida', 'fruta', 'nombre de persona', 'objeto', 'color', 'profesión', 'marca', 'ciudad', 'película', 'deporte', 'flor', 'canción', 'lugar']

export default {
  name: 'stop',
  tags: 'group',
  command: ['stop', 'adedonha', 'sopadeletras'],
  description: 'Juego Adedonha/Stop: adivina palabras con una letra y tema',
  example: 'stop',
  group: true,
  run: async (m, { sock }) => {
    const letra = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random() * 26)]
    const tema = temas[Math.floor(Math.random() * temas.length)]
    const teks = `🎮 *ADEDONHA / STOP*\n\n`
      + `> *Letra:* ${letra}\n`
      + `> *Tema:* ${tema}\n\n`
      + `Respondan con una palabra que empiece con *${letra}* y sea del tema *${tema}*.\n`
      + `¡El primero en responder gana! 🏆\n`
      + global.set.footer
    m.reply(teks)
  }
}
