/*  [ Ginko - Descarga de TikTok con Fallback ]
 *  Intenta varias APIs de descarga de TikTok hasta que una funcione.
 *  Hace que .tiktok sea más fiable.
 */

// APIs de descarga de TikTok (con fallback automático)
async function probarAPIs(url, fuentes) {
  let ultimoError = null
  for (const fuente of fuentes) {
    try {
      const res = await fuente(url)
      if (res) return res
    } catch (e) {
      ultimoError = e
      console.error(`[TikTok] fuente falló:`, e.message)
    }
  }
  throw ultimoError || new Error('Todas las APIs fallaron')
}

export async function tiktokDl(url) {
  const axios = (await import('axios')).default

  const fuentes = [
    // Fuente 1: tikwm (común y estable)
    async (u) => {
      const { data } = await axios.get('https://www.tikwm.com/api/', { params: { url: u }, timeout: 30000 })
      if (!data?.data) throw new Error('tikwm sin datos')
      return {
        play: data.data.play,
        title: data.data.title || '',
        author: data.data.author?.unique_id || '',
        duration: data.data.duration || '',
        images: data.data.images || null,
        music: data.data.music || ''
      }
    },
    // Fuente 2: otra API pública
    async (u) => {
      const { data } = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(u)}`, { timeout: 30000 })
      if (!data?.video) throw new Error('tiklydown sin datos')
      return {
        play: data.video.noWatermark || data.video.withWatermark,
        title: data.title || '',
        author: data.author?.uniqueId || '',
        duration: '',
        images: data.photos || null,
        music: data.music || ''
      }
    },
    // Fuente 3: ssyoutube/tiktok api
    async (u) => {
      const { data } = await axios.get(`https://deliriusapi-oficial.vercel.app/download/tiktok?url=${encodeURIComponent(u)}`, { timeout: 30000 })
      const d = data?.data
      if (!d) throw new Error('delirius sin datos')
      return {
        play: d.play || d.video,
        title: d.title || '',
        author: d.author?.unique_id || '',
        duration: d.duration || '',
        images: d.images || null,
        music: d.music_info?.play || ''
      }
    }
  ]

  return probarAPIs(url, fuentes)
}
