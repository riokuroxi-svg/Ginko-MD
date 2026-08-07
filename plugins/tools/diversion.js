/*  [ Ginko - Diversión ]
 *  Comandos divertidos: piropos, personalidad, love, gay, iqtest, zodiac.
 *  Adaptado de Ai-Hoshino.
 */
const piropos = [
  "Si la belleza fuera un crimen, te sentenciarían a cadena perpetua 😍",
  "¿Tienes un mapa? Porque me pierdo en tus ojos 🗺️",
  "Si fueras un boomerang, nunca volverías porque te irías conmigo 😏",
  "¿Eres de azúcar? Porque estás endulzando mi vida 🍬",
  "Si el amor es ciego, al menos yo tengo una cita a ciegas contigo 😉",
  "¿Tienes fuego? Porque me has encendido el corazón 🔥",
  "Si la luna es de queso, tú eres la estrella de mi cielo 🌙",
]

const personalidades = ['valiente', 'tímido', 'extrovertido', 'analítico', 'creativo', 'leal', 'aventurero', 'romántico', 'gracioso', 'inteligente']

export default {
  name: 'diversion',
  tags: 'tools',
  command: ['piropo', 'personalidad', 'love', 'gay', 'iqtest', 'zodiac', 'gaytest'],
  description: 'Comandos divertidos: piropo, personalidad, love, gay, iq, zodiac',
  example: 'piropo | personalidad | love | gay | iqtest | zodiac',
  tools: true,
  run: async (m, { sock, command, text }) => {
    const jid = m.sender.split('@')[0]
    const name = m.pushName || jid

    // PIROPO
    if (command === 'piropo') {
      const p = piropos[Math.floor(Math.random() * piropos.length)]
      return m.reply(`💘 *Piropos*\n\n> ${p}\n\n_— para @${jid}_`, { mentions: [m.sender] })
    }

    // PERSONALIDAD
    if (command === 'personalidad') {
      const p = personalidades[Math.floor(Math.random() * personalidades.length)]
      return m.reply(`🧠 *TEST DE PERSONALIDAD*\n\n> ${name}, tu personalidad es: *${p}*\n> Compatibilidad: ${Math.floor(Math.random()*50)+50}%`)
    }

    // LOVE
    if (command === 'love') {
      const pareja = m.mentions && m.mentions[0] ? m.mentions[0].split('@')[0] : 'tu crush'
      const love = Math.floor(Math.random() * 101)
      return m.reply(`💕 *TEST DE AMOR*\n\n> ${name} 💘 ${pareja}\n> Compatibilidad: *${love}%*\n${love > 70 ? '😍 ¡Perfectos el uno para el otro!' : love > 40 ? '😊 Hay algo bonito ahí...' : '😅 Quizás no...'}`, { mentions: m.mentions })
    }

    // GAY
    if (command === 'gay' || command === 'gaytest') {
      const gay = Math.floor(Math.random() * 101)
      return m.reply(`🏳️‍🌈 *TEST GAY*\n\n> ${name} es *${gay}% gay* 🏳️‍🌈\n> ${gay > 70 ? '¡Muy orgulloso! 😄' : gay > 40 ? 'Un poco 😏' : 'Nada gay 😎'}`, { mentions: [m.sender] })
    }

    // IQ TEST
    if (command === 'iqtest') {
      const iq = Math.floor(Math.random() * 80) + 80
      return m.reply(`🧠 *TEST DE IQ*\n\n> ${name} tiene un IQ de: *${iq}*\n> ${iq > 140 ? '¡Genio! 🤯' : iq > 110 ? 'Muy inteligente 🧠' : 'Promedio 👍'}`)
    }

    // ZODIAC
    if (command === 'zodiac') {
      const signos = ['Aries ♈', 'Tauro ♉', 'Géminis ♊', 'Cáncer ♋', 'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Escorpio ♏', 'Sagitario ♐', 'Capricornio ♑', 'Acuario ♒', 'Piscis ♓']
      const s = signos[Math.floor(Math.random() * 12)]
      return m.reply(`🔮 *HORÓSCOPO*\n\n> Tu signo es: *${s}*\n> Suerte hoy: ${Math.floor(Math.random()*100)}%\n> Recomendación: ${['sé amable', 'confía en ti', 'ayuda a alguien', 'descansa', 'sonríe'][Math.floor(Math.random()*5)]}`)
    }
  }
}
