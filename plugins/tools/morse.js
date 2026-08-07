/*  [ Ginko - Código Morse ]
 *  Convierte texto a código morse y viceversa.
 *  Uso: .morse <texto>  |  .demorse <codigo>
 *  Adaptado de Ai-Hoshino.
 */
const MORSE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
}
const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

export default {
  name: 'morse',
  tags: 'tools',
  command: ['morse', 'demorse'],
  description: 'Convierte texto a código morse (y viceversa)',
  example: 'morse hola  |  demorse .... --- .-.. .-',
  tools: true,
  run: async (m, { sock, command, text }) => {
    if (!text) throw `❌ Escribe el texto. Ej: ${m.prefix}morse hola`

    if (command === 'demorse') {
      const resultado = text.split(' ').map(s => REV[s] || s).join('').replace(/\//g, ' ')
      return m.reply(`📡 *DEMORSE*\n\n> *${text}*\n>\n> ${resultado.toLowerCase()}`)
    }

    const resultado = text.toUpperCase().split('').map(c => MORSE[c] || c).join(' ')
    m.reply(`📡 *CÓDIGO MORSE*\n\n> *${text}*\n>\n> \`${resultado}\`\n\n> Para decodificar: .demorse ${resultado}`)
  }
}
