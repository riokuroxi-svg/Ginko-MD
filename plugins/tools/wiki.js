/*  [ Ginko - Wikipedia ]
 *  Busca información en Wikipedia (español).
 *  Uso: .wiki <término>
 */
export default {
  name: 'wiki',
  tags: 'tools',
  command: ['wiki', 'wikipedia'],
  description: 'Busca información en Wikipedia',
  example: 'wiki inteligencia artificial',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'wiki', 'inteligencia artificial')
    m.reply(global.status.wait)
    try {
      const { data } = await axios.get('https://es.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(text.trim()), {
        timeout: 20000,
        headers: { 'User-Agent': 'GinkoBot/1.0' }
      })
      if (!data?.extract) throw 'no-result'
      let teks = `📚 *${data.title}*\n\n`
      teks += (data.extract || 'Sin resumen disponible') + '\n\n'
      if (data.description) teks += `*Categoría:* ${data.description}\n`
      if (data.content_urls?.desktop?.page) teks += `🔗 ${data.content_urls.desktop.page}\n`
      teks += global.set.footer
      if (data.thumbnail?.source) {
        await sock.sendMessage(m.chat, { image: { url: data.thumbnail.source }, caption: teks }, { quoted: m })
      } else {
        m.reply(teks)
      }
    } catch (e) {
      console.error('[Wiki]', e)
      throw '❌ No encontré resultados para esa búsqueda.'
    }
  }
}
