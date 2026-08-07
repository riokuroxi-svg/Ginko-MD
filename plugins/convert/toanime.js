/*  [ Ginko - Foto a Anime ]
 *  Convierte tu foto (o la citada) a estilo anime.
 *  Uso: responde a una imagen con .toanime
 *
 *  Nota: usa la API gratuita de photoleap (misma que usa el comando .imagen).
 */
export default {
  name: 'toanime',
  tags: 'convert',
  command: ['toanime', 'animeface', 'fanime'],
  description: 'Convierte tu foto a estilo anime',
  example: 'responde a una imagen',
  run: async (m, { sock }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) throw `❌ Responde a una *imagen* con ${m.prefix}toanime`

    m.reply('🎨 *Convirtiendo a anime...*')
    let media = await q.download()
    try {
      // Subir la imagen y obtener URL
      let up = await Uploader(media)
      if (!up?.url) throw 'no-url'
      // Usar una API de imagen->anime gratuita
      const { data } = await axios.post('https://photo-anime.vercel.app/photo', {
        url: up.url,
      }, { timeout: 30000 })
      let result = data?.data?.url || data?.url || data?.output_url
      if (!result) throw 'no-result'
      await sock.sendMessage(m.chat, { image: { url: result }, caption: `✨ *Foto a Anime* - ${global.set.wm}` }, { quoted: m })
    } catch (e) {
      console.error('[ToAnime]', e)
      throw '❌ No pude convertir la imagen. La API puede estar caída o bloqueada.'
    }
  }
}
