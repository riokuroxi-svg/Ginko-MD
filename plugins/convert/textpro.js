/*  [ Ginko - Creador de Logo / Efectos de Texto ]
 *  Crea imágenes con efectos de texto (logos).
 *  Función adaptada de bots indonesios (textpro / ephoto).
 *  Uso: .logo <efecto>|<texto>
 *  Efectos: fuego, neón, cristal, oro, 3d, gradient, glitch
 */
const fxList = {
  fuego: 'https://textpro.me/fire-logo-186.html',
  neon: 'https://textpro.me/neon-text-effect-879.html',
  cristal: 'https://textpro.me/crystal-text-effect-681.html',
  oro: 'https://textpro.me/gold-text-effect-232.html',
  '3d': 'https://textpro.me/3d-text-effect-916.html',
  gradient: 'https://textpro.me/gradient-text-effect-1631.html',
  glitch: 'https://textpro.me/glitch-text-effect-1029.html',
}

export default {
  name: 'logo',
  tags: 'convert',
  command: ['logo', 'textpro', 'logoefecto'],
  description: 'Crea un logo/efecto de texto',
  example: 'logo fuego|Ginko',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'logo', 'fuego|Ginko')
    const [fxRaw, ...txtArr] = text.split('|')
    const txt = txtArr.join('|').trim()
    const fx = (fxRaw || '').toLowerCase().trim()
    if (!fxList[fx] || !txt) throw `❌ Uso: ${m.prefix}logo efecto|texto\nEfectos: ${Object.keys(fxList).join(', ')}`

    m.reply('🎨 *Generando logo...*')
    try {
      // API pública de textpro
      const { data } = await axios.post('https://tokisaki.my.id/api/textpro', {
        url: fxList[fx],
        text: [txt],
      }, { timeout: 30000 })
      const imgUrl = data?.image || data?.result || data?.data?.url
      if (!imgUrl) throw 'no-result'
      await sock.sendMessage(m.chat, { image: { url: imgUrl }, caption: `✨ *Logo* (${fx}) - ${global.set.wm}` }, { quoted: m })
    } catch (e) {
      console.error('[Logo]', e)
      throw '❌ No pude generar el logo. La API puede estar caída.'
    }
  }
}
