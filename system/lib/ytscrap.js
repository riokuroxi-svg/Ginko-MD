import fetch from 'node-fetch';

/*  [ Ginko - Descarga YouTube con Fallback ]
 *  Intenta varias APIs de descarga hasta que una funcione.
 *  Esto hace que .play/.ytv/.ytmp4 no fallen si una API está caída.
 */

// Lista de APIs de descarga de YouTube (con fallback automático)
const APIs = [
  {
    name: 'shinoa',
    url: 'https://shinoa.us.kg/api/download/ytdl',
    method: 'POST',
    headers: { 'accept': '*/*', 'api_key': 'free', 'Content-Type': 'application/json' },
    body: (url) => JSON.stringify({ text: url }),
    parse: (data) => data
  },
  {
    name: 'delirius',
    url: (url) => `https://deliriussapi-oficial.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`,
    method: 'GET',
    parse: (data) => data
  },
  {
    name: 'elxyz',
    url: (url) => `https://elxyz.me/api/download/youtube?url=${encodeURIComponent(url)}`,
    method: 'GET',
    parse: (data) => data
  },
];

export async function ytdl(url) {
  let lastError = null;

  // Probar cada API en orden
  for (const api of APIs) {
    try {
      let response;
      if (api.method === 'POST') {
        response = await fetch(api.url, {
          method: 'POST',
          headers: api.headers,
          body: api.body(url)
        });
      } else {
        response = await fetch(typeof api.url === 'function' ? api.url(url) : api.url);
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      // Verificar que la respuesta tenga datos útiles
      const parsed = api.parse(data);
      if (parsed && (parsed.data?.mp3 || parsed.data?.audio || parsed.data?.link || parsed.data?.url || parsed.result)) {
        return parsed;
      }
      throw new Error('respuesta vacía');
    } catch (e) {
      console.error(`[ytdl] API ${api.name} falló:`, e.message);
      lastError = e;
      continue;
    }
  }

  throw new Error('Todas las APIs de descarga fallaron: ' + (lastError?.message || 'desconocido'));
}
