/*  [ Ginko - Buscar Anime ]
 *  Busca información de anime con portada usando AniList API (gratuita y estable).
 *  Uso: .anime <nombre>
 */
import axios from 'axios'

export default {
  name: 'anime',
  tags: 'tools',
  command: ['anime', 'animeinfo', 'anibusc'],
  description: 'Busca información de un anime (AniList)',
  example: 'anime one piece',
  limit: false,
  run: async (m, { sock, text }) => {
    if (!text) throw Func.example(m.prefix, 'anime', 'one piece')
    m.reply('🔍 *Buscando anime...*')
    try {
      // AniList GraphQL query
      const query = `
        query ($search: String) {
          Media (search: $search, type: ANIME) {
            title { romaji english native }
            description(asHtml: false)
            coverImage { large }
            bannerImage
            averageScore
            episodes
            status
            seasonYear
            genres
            studios(isMain: true) { nodes { name } }
          }
        }`
      const { data } = await axios.post('https://graphql.anilist.co', {
        query, variables: { search: text }
      }, { timeout: 30000 })

      const media = data?.data?.Media
      if (!media) return m.reply('❌ Anime no encontrado.')

      const titulo = media.title?.romaji || media.title?.english || media.title?.native || '?'
      const desc = (media.description || 'Sin descripción').replace(/<[^>]*>/g, '').slice(0, 300)

      const teks = `🎬 *${titulo}*\n\n`
        + `*Título EN:* ${media.title?.english || 'N/A'}\n`
        + `*Título JP:* ${media.title?.native || 'N/A'}\n\n`
        + `*Episodios:* ${media.episodes || 'N/A'}\n`
        + `*Estado:* ${media.status || 'N/A'}\n`
        + `*Año:* ${media.seasonYear || 'N/A'}\n`
        + `*Puntuación:* ${media.averageScore ? media.averageScore + '/100' : 'N/A'}\n`
        + `*Géneros:* ${(media.genres || []).join(', ') || 'N/A'}\n`
        + `*Estudio:* ${media.studios?.nodes?.[0]?.name || 'N/A'}\n\n`
        + `*Sinopsis:*\n${desc}${desc.length >= 300 ? '...' : ''}\n\n`
        + global.set.footer

      if (media.coverImage?.large) {
        await sock.sendMessage(m.chat, { image: { url: media.coverImage.large }, caption: teks }, { quoted: m })
      } else {
        m.reply(teks)
      }
    } catch (e) {
      console.error('[Anime]', e.message)
      m.reply('❌ No se pudo buscar el anime. Intenta con otro nombre.')
    }
  }
}
