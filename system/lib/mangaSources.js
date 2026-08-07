/*  [ Ginko - Fuentes de Manga con fallback ]
 *  Sistema de múltiples fuentes de manga con fallback automático.
 *
 *  Fuentes:
 *   1. MangaDex (API oficial, estable) — principal
 *   2. InManga (scraping, en español) — respaldo
 *
 *  Cómo funciona:
 *   - Intenta la primera fuente.
 *   - Si falla, pasa a la siguiente automáticamente.
 *   - Si todas fallan, devuelve el error final (no se congela).
 *
 *  + Lector del index.json de Keiyoushi (extensiones de Tachiyomi/Mihon):
 *    consulta las fuentes activas de manga en español (mantenidas por la comunidad).
 */
import axios from 'axios'

const UA = 'GinkoBot/1.0 (personal WhatsApp bot)'
const api = axios.create({ timeout: 30000, headers: { 'User-Agent': UA } })

// ---------------------------------------------------------------
// Lector de Keiyoushi (lista viva de fuentes de manga en español)
// ---------------------------------------------------------------
export async function obtenerFuentesActivasEsp() {
  try {
    const { data } = await api.get('https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.json', { timeout: 20000 })
    const exts = data?.extensionList?.extensions || []
    // Fuentes en español (.es.)
    const es = exts.filter(e => e.packageName?.includes('.es.'))
    return es.map(e => ({
      name: e.name,
      id: e.packageName.split('.').pop(),
      activa: true
    }))
  } catch (e) {
    console.error('[Keiyoushi] No se pudo obtener fuentes:', e.message)
    return []
  }
}

// ---------------------------------------------------------------
// Configuración de fuentes
// ---------------------------------------------------------------
function getFuentes() {
  const cfg = global.mangaFuentes || {}
  return [
    // Fuente 1: MangaDex (API oficial estable)
    {
      id: 'mangadex',
      nombre: 'MangaDex',
      activa: true,
      base: cfg.mangadex?.base || 'https://api.mangadex.org',
      buscar: (q) => ({ url: `${cfg.mangadex?.base || 'https://api.mangadex.org'}/manga`, params: { title: q, limit: 8, 'availableTranslatedLanguage[]': ['es', 'en'] } }),
      caps: (id) => ({ url: `${cfg.mangadex?.base || 'https://api.mangadex.org'}/manga/${id}/feed`, params: { 'translatedLanguage[]': ['es', 'en'], order: { chapter: 'asc' }, limit: 100 } }),
      leer: (id, cap) => ({ url: `${cfg.mangadex?.base || 'https://api.mangadex.org'}/manga/${id}/feed`, params: { 'translatedLanguage[]': ['es', 'en'], 'chapter[]': cap, limit: 1 } }),
      imagenes: async (chapterId) => {
        const { data } = await api.get(`${cfg.mangadex?.base || 'https://api.mangadex.org'}/at-home/server/${chapterId}`)
        return { baseUrl: data.baseUrl, hash: data.chapter?.hash, pages: data.chapter?.data || [] }
      }
    },
    // Fuente 2: InManga (scraping, español) — respaldo
    {
      id: 'inmanga',
      nombre: 'InManga',
      activa: cfg.inmanga?.activa ?? true,
      base: cfg.inmanga?.base || 'https://inmanga.com',
      buscar: async (q) => {
        // InManga usa POST con JSON
        const { data } = await api.post(`${cfg.inmanga?.base || 'https://inmanga.com'}/manga/getMangasConsultResult`, {
          order: 'DESC', orderField: 'name', page: '1', search: q, type: 'all'
        }, { headers: { 'Content-Type': 'application/json', 'Referer': 'https://inmanga.com/' } })
        return data
      },
      // InManga no tiene API limpia para capítulos -> marcamos como no soportado leer
      caps: () => { throw new Error('InManga: usa MangaDex para ver capítulos') },
      leer: () => { throw new Error('InManga: usa MangaDex para leer') },
      imagenes: async () => { throw new Error('InManga: usa MangaDex para imágenes') }
    }
  ].filter(f => f.activa)
}

// ---------------------------------------------------------------
// Búsqueda con fallback entre fuentes
// ---------------------------------------------------------------
export async function buscarMangaFuentes(query) {
  const fuentes = getFuentes()
  let errores = []

  for (const fuente of fuentes) {
    try {
      // Las fuentes pueden devolver config o hacer la petición directamente
      let data
      if (typeof fuente.buscar === 'function' && fuente.buscar.length >= 2) {
        // busca con (query, api) — no usamos
      }
      // MangaDex: buscar devuelve config
      if (fuente.id === 'mangadex') {
        const config = fuente.buscar(query)
        const res = await api.get(config.url, { params: config.params })
        data = res.data
      } else {
        // InManga: buscar devuelve directamente el HTML
        data = await fuente.buscar(query)
      }

      const resultados = normalizarBusqueda(fuente, data)
      if (resultados.length) return { fuente: fuente.nombre, data: resultados }
    } catch (e) {
      errores.push(`${fuente.nombre}: ${e.message}`)
      console.error(`[Manga] fuente ${fuente.nombre} falló:`, e.message)
    }
  }

  throw new Error('Todas las fuentes fallaron: ' + errores.slice(0,2).join(' | '))
}

// ---------------------------------------------------------------
// Normalizar resultados de cada fuente a formato común
// ---------------------------------------------------------------
function normalizarBusqueda(fuente, data) {
  if (fuente.id === 'mangadex') {
    return (data?.data || []).map(m => ({
      id: m.id,
      title: m.attributes?.title?.es || m.attributes?.title?.en || m.attributes?.title?.['ja-ro'] || 'Sin título',
      fuente: 'mangadex'
    }))
  }

  if (fuente.id === 'inmanga') {
    // InManga devuelve HTML con /ver/manga/NOMBRE/ID
    const html = typeof data === 'string' ? data : String(data)
    const links = [...html.matchAll(/\/ver\/manga\/([^/"]+)\/([a-f0-9-]+)/g)]
    return links.map(l => ({
      id: l[2],
      slug: l[1],
      title: l[1].replace(/-/g, ' '),
      fuente: 'inmanga'
    }))
  }

  return []
}

export { getFuentes, api }
