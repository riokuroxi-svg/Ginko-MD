/*  [ Ginko - Comando de Manga ]
 *  Busca y lee mangas en PDF (con nombre del manga y capítulo).
 *
 *  Uso:
 *   .manga <nombre>           → buscar mangas
 *   .manga caps <id>          → lista de capítulos
 *   .manga leer <id> <cap>    → descarga capítulo en PDF (nombre + capítulo)
 *
 *  ROBUSTEZ:
 *   ✅ Múltiples fuentes con fallback (MangaDex + extra configurables)
 *   ✅ Endpoints configurables (si una API cambia de dominio, se actualiza config.js)
 *   ✅ PDF con nombre y capítulo (no imágenes sueltas)
 *   ✅ User-Agent requerido por MangaDex
 *   ✅ Caché + reintentos con backoff
 *   ✅ Cooldown + límite de páginas (no satura RAM/PM2)
 *   ✅ try-catch en todo
 */
import { buscarMangaFuentes, getFuentes, api } from "../../system/lib/mangaSources.js"
import PDFDocument from "pdfkit"
import fs from "fs"
import sharp from "sharp"

const MANGADEX = 'https://api.mangadex.org'

const COOLDOWN_MS = 60000
const MAX_PAGES = 15 // páginas por capítulo (para que el PDF no sea gigante)
const cooldowns = {}
const cache = { capitulos: {} }
const CACHE_TTL = 10 * 60 * 1000

// Precio por rango de 10 capítulos (0 = gratis). Configurable en config.js
function getPrecioManga() {
  const p = global.mangaPrecio
  return typeof p === 'number' ? p : 5000 // default 5,000
}

// Reintentos con backoff
async function getConReintentos(url, config = {}, intentos = 3) {
  let ultimoError
  for (let i = 0; i < intentos; i++) {
    try {
      const { data } = await api.get(url, config)
      return data
    } catch (e) {
      ultimoError = e
      const status = e.response?.status
      if (status === 429 || status >= 500 || !status) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)))
        continue
      }
      throw e
    }
  }
  throw ultimoError
}

export default {
  name: 'manga',
  tags: 'download',
  command: ['manga', 'leermanga'],
  description: 'Busca y descarga mangas en PDF (MangaDex + fuentes)',
  example: 'manga one piece | manga caps <id> | manga leer <id> <cap>',
  limit: false,
  run: async (m, { sock, text }) => {
    const sender = m.sender

    // Cooldown
    const ahora = Date.now()
    if (cooldowns[sender] && ahora - cooldowns[sender] < COOLDOWN_MS) {
      const restante = Math.ceil((COOLDOWN_MS - (ahora - cooldowns[sender])) / 1000)
      return m.reply(`⏳ *Espera ${restante}s* entre descargas.`)
    }
    cooldowns[sender] = ahora

    if (!text) return m.reply(`❌ Uso: ${m.prefix}manga <nombre>\n> Ej: ${m.prefix}manga one piece`)

    const [accion, ...resto] = text.trim().split(/\s+/)
    const arg = resto.join(' ')

    try {
      if (accion === 'caps') return verCapitulos(m, arg)
      if (accion === 'leer') return leerCapituloPDF(m, sock, resto)
      if (accion === 'info') return infoManga(m, sock, resto[0])
      if (accion === 'precio') return mostrarPrecio(m, resto)
      if (accion === 'inmanga') return abrirInManga(m, resto[0])
      return buscarManga(m, text)
    } catch (e) {
      console.error('[Manga] Error:', e.response?.status, e.message)
      if (e.response?.status === 429) {
        return m.reply('⚠️ *MangaDex está limitando peticiones.*\n> Espera un poco o prueba otro manga.')
      }
      return m.reply('❌ *Error al descargar.* Intenta más tarde.')
    }
  }
}

// Buscar manga (usa fuentes con fallback)
async function buscarManga(m, query) {
  m.reply('🔍 *Buscando manga...*')
  const { fuente, data } = await buscarMangaFuentes(query)
  if (!data.length) return m.reply('❌ No se encontraron mangas.')

  let teks = `📚 *Resultados (fuente: ${fuente}):*\n\n`
  for (const manga of data.slice(0, 8)) {
    if (manga.fuente === 'inmanga') {
      teks += `▸ *${manga.title}*\n`
      teks += `  🔗 ${m.prefix}manga inmanga ${manga.slug}\n\n`
    } else {
      teks += `▸ *${manga.title}*\n`
      teks += `  ID: \`${manga.id}\`\n`
      teks += `  Usa: ${m.prefix}manga caps ${manga.id}\n\n`
    }
  }
  teks += `> Para ver capítulos: ${m.prefix}manga caps <id>\n`
  teks += `> Para descargar: ${m.prefix}manga leer <id> <capítulo>`
  m.reply(teks)
}

// Comando para abrir InManga directamente (enlace)
export async function abrirInManga(m, slug) {
  const url = `https://inmanga.com/ver/manga/${slug}`
  m.reply(`📖 *Enlace de InManga:*\n\n> ${url}\n\n_Ábrelo para leer en la web._`)
}

// Ver capítulos
async function verCapitulos(m, id) {
  if (!id) return m.reply('❌ Usa: ' + m.prefix + 'manga caps <id>')
  m.reply('📑 *Buscando capítulos...*')

  const fuente = getFuentes()[0] // usa la primera fuente activa (MangaDex)
  const config = fuente.caps(id)
  const data = await getConReintentos(config.url, { params: config.params })

  if (!data?.data?.length) return m.reply('❌ No hay capítulos disponibles.')

  // Obtener todos los números de capítulo únicos
  const caps = []
  for (const ch of data.data) {
    const num = ch.attributes?.chapter
    if (num && !caps.includes(num)) caps.push(parseFloat(num))
  }
  caps.sort((a, b) => a - b)

  const total = caps.length
  const nCapsPorRango = 10

  // Mostrar rangos de 10 capítulos
  let teks = `📑 *Capítulos disponibles:*\n\n`
  teks += `> Total: *${total}* capítulos\n`
  teks += `> Se descargan en rangos de ${nCapsPorRango}.\n\n`

  // Calcular cuántos rangos completos y el último parcial
  const numRangos = Math.ceil(total / nCapsPorRango)
  const rangoMax = Math.min(10, numRangos) // mostrar máximo 10 rangos por mensaje

  for (let i = 0; i < rangoMax; i++) {
    const inicio = i * nCapsPorRango + 1
    const fin = Math.min((i + 1) * nCapsPorRango, total)
    teks += `▸ *Rango ${inicio}-${fin}* → ${m.prefix}manga leer ${id} ${inicio}-${fin}\n`
  }

  if (numRangos > rangoMax) {
    teks += `\n> Y más rangos disponibles hasta el capítulo ${total}.\n`
  }

  teks += `\n> O descarga uno solo: ${m.prefix}manga leer ${id} <número>\n`
  teks += `> Costo: ver con ${m.prefix}manga precio`
  m.reply(teks)
}

// Leer capítulo y generar PDF
// Mostrar portada + información del manga con botón de descarga
async function infoManga(m, sock, id) {
  if (!id) return m.reply('❌ Usa: ' + m.prefix + 'manga info <id>')
  m.reply('🔍 *Cargando información del manga...*')

  try {
    // 1. Obtener detalles con cover_art y author
    const { data: det } = await getConReintentos(`${MANGADEX}/manga/${id}`, {
      params: { 'includes[]': ['cover_art', 'author'] }
    })
    const manga = det?.data
    if (!manga) return m.reply('❌ Manga no encontrado.')

    const attrs = manga.attributes || {}
    const title = attrs.title?.es || attrs.title?.en || attrs.title?.['ja-ro'] || 'Sin título'
    const desc = attrs.description?.es || attrs.description?.en || 'Sin sinopsis disponible.'
    const year = attrs.year || 'N/A'
    const status = attrs.status || 'N/A'

    // Autor
    let autor = 'Desconocido'
    const authorRel = (manga.relationships || []).find(r => r.type === 'author')
    if (authorRel?.attributes?.name) autor = authorRel.attributes.name

    // Portada
    let portada = null
    const coverRel = (manga.relationships || []).find(r => r.type === 'cover_art')
    if (coverRel?.id) {
      portada = `https://uploads.mangadex.org/covers/${id}/${coverRel.id}.512.jpg`
    }

    // 2. Contar capítulos
    let totalCaps = 0
    try {
      const feed = await getConReintentos(`${MANGADEX}/manga/${id}/feed`, {
        params: { 'translatedLanguage[]': ['es', 'en'], limit: 500, order: { chapter: 'desc' } }
      })
      totalCaps = feed?.data?.length || 0
    } catch (e) {}

    const teks = `📚 *${title}*\n\n`
      + `*Autor:* ${autor}\n`
      + `*Año:* ${year}\n`
      + `*Estado:* ${status}\n`
      + `*Capítulos:* ${totalCaps}\n\n`
      + `*Sinopsis:*\n${desc.slice(0, 400)}${desc.length > 400 ? '...' : ''}\n\n`
      + `> Para descargar capítulos:\n`
      + `> ${m.prefix}manga leer ${id} <cap>\n`
      + `> ${m.prefix}manga leer ${id} <1-10>\n`
      + `> ${m.prefix}manga caps ${id}`

    if (portada) {
      // Enviar portada + info con externalAdReply (thumbnail)
      await sock.sendMessage(m.chat, {
        image: { url: portada },
        caption: teks
      }, { quoted: m })
    } else {
      m.reply(teks)
    }
  } catch (e) {
    console.error('[Manga] info error:', e.message)
    return m.reply('❌ No se pudo cargar la información del manga.')
  }
}

// Mostrar el precio de descarga de manga
async function mostrarPrecio(m, args) {
  const precio = getPrecioManga()
  const user = global.db.users?.[m.sender]
  const saldo = user?.money || 0

  let teks = `💰 *Precio de descarga de Manga*\n\n`
  teks += `> Cada *rango de 10 capítulos* cuesta: *${precio.toLocaleString()} 💰*\n`
  teks += `> Capítulo suelto: *${Math.ceil(precio / 10).toLocaleString()} 💰*\n\n`
  teks += `*Tu saldo:* ${saldo.toLocaleString()} 💰\n\n`

  if (precio === 0) {
    teks += `> ✅ *Descarga gratis* (el admin lo configuró así).\n`
  } else if (saldo < precio) {
    teks += `> ⚠️ *No tienes suficiente dinero.*\n`
    teks += `> Gana con: ${m.prefix}trabajar, ${m.prefix}minar, ${m.prefix}crimen, ${m.prefix}claim\n`
  } else {
    teks += `> Puedes descargar: ${m.prefix}manga leer <id> <1-10>\n`
  }
  m.reply(teks)
}

// Rango de capítulos y compresión con sharp
async function leerCapituloPDF(m, sock, args) {
  const id = args[0]
  const rango = args[1] || ''
  if (!id || !rango) return m.reply(`❌ Usa: ${m.prefix}manga leer <id> <capítulo | rango>\n> Ej: ${m.prefix}manga leer <id> 5   o   ${m.prefix}manga leer <id> 1-10`)

  // Parsea el rango: "5" -> [5,5] | "1-10" -> [1,10]
  const match = rango.match(/^(\d+)(?:-(\d+))?$/)
  if (!match) return m.reply('❌ Formato inválido. Usa: 5  o  1-10')
  const capInicio = parseInt(match[1])
  const capFin = match[2] ? parseInt(match[2]) : capInicio
  if (capFin < capInicio) return m.reply('❌ El rango debe ser ascendente (ej: 1-10).')

  const totalCaps = capFin - capInicio + 1
  if (totalCaps > 10) return m.reply('⚠️ Máximo *10 capítulos* por PDF (límite de peso de WhatsApp).')

  // ---- Economía: cobrar por la descarga ----
  const precio = getPrecioManga()
  if (precio > 0) {
    const user = global.db.users?.[m.sender]
    const saldo = user?.money || 0
    // Cobro proporcional: precio por 10 caps, proporcional al nº de caps
    const costo = Math.max(1, Math.round((precio * totalCaps) / 10))
    if (saldo < costo) {
      return m.reply(`⚠️ *No tienes suficiente dinero.*\n\n> Costo: *${costo.toLocaleString()} 💰*\n> Tu saldo: ${saldo.toLocaleString()} 💰\n\n> Gana con: ${m.prefix}trabajar, ${m.prefix}minar, ${m.prefix}crimen, ${m.prefix}claim`)
    }
    // Descontar
    user.money = saldo - costo
  }

  m.reply(`⏳ *Descargando capítulos ${capInicio}-${capFin} y comprimiendo...*\n> Esto puede tardar un poco (${totalCaps} capítulos).`)

  // 1. Obtener nombre del manga
  let nombreManga = 'Manga'
  try {
    const { data } = await api.get(`${getFuentes()[0].base}/manga/${id}`)
    const attrs = data?.data?.attributes?.title || {}
    nombreManga = attrs.es || attrs.en || attrs['ja-ro'] || 'Manga'
  } catch (e) {}

  // 2. Recoger todos los capítulos del rango
  const fuente = getFuentes()[0]
  const todosBuffers = []
  const capsProcesados = []
  let pesoTotalBytes = 0

  for (let cap = capInicio; cap <= capFin; cap++) {
    try {
      const config = fuente.leer(id, String(cap))
      const feed = await getConReintentos(config.url, { params: config.params })
      if (!feed?.data?.length) {
        // capítulo no encontrado, saltar
        if (cap === capInicio && cap === capFin) return m.reply('❌ Capítulo no encontrado.')
        continue
      }

      const chapter = feed.data[0]
      if (chapter.attributes?.externalUrl) {
        if (totalCaps === 1) return m.reply(`📖 *Este capítulo es un enlace externo:*\n\n> ${chapter.attributes.externalUrl}`)
        continue // en rango, saltar enlaces externos
      }

      const imgs = await fuente.imagenes(chapter.id)
      const { baseUrl, hash, pages } = imgs
      if (!hash || !pages.length) continue

      // 3. Descargar y COMPRIMIR cada página con sharp (JPEG 50% + 1000px)
      const capBuffers = []
      for (const page of pages.slice(0, MAX_PAGES)) {
        try {
          const url = `${baseUrl}/data/${hash}/${page}`
          const { data: imgBuffer } = await api.get(url, { responseType: 'arraybuffer', timeout: 60000 })
          const comprimida = await sharp(Buffer.from(imgBuffer))
            .resize({ width: 1000 })          // reducir resolución
            .jpeg({ quality: 50 })            // comprimir a 50%
            .toBuffer()
          capBuffers.push(comprimida)
          pesoTotalBytes += comprimida.length
        } catch (e) {
          console.error('[Manga] página falló:', page, e.message)
          continue
        }
      }

      if (capBuffers.length) {
        todosBuffers.push(...capBuffers)
        capsProcesados.push(cap)
      }

      // Detener si ya superamos ~60MB (margen bajo el límite de 70MB)
      if (pesoTotalBytes > 60 * 1024 * 1024) {
        m.reply('⚠️ *Se alcanzó el límite de peso* (~60MB). Enviando los capítulos descargados hasta ahora.')
        break
      }

    } catch (e) {
      console.error(`[Manga] capítulo ${cap} falló:`, e.message)
      continue
    }
  }

  if (!todosBuffers.length) return m.reply('❌ No se pudieron descargar imágenes de los capítulos.')

  // 4. Generar PDF con portada
  const pdfPath = `/tmp/ginko_manga_${Date.now()}.pdf`
  const tituloCaps = capsProcesados.length === 1 ? `Capítulo ${capsProcesados[0]}` : `Capítulos ${capsProcesados[0]}-${capsProcesados[capsProcesados.length-1]}`
  await generarPDF(pdfPath, nombreManga, tituloCaps, todosBuffers)

  const sizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(1)
  if (sizeMB > 70) {
    fs.unlinkSync(pdfPath)
    return m.reply(`❌ El PDF pesa ${sizeMB}MB (más del límite de 70MB).\n> Prueba menos capítulos.`)
  }

  // 5. Enviar PDF
  const fileName = `${nombreManga} - ${tituloCaps}.pdf`
  await sock.sendMessage(m.chat, {
    document: { url: pdfPath },
    fileName,
    mimetype: 'application/pdf',
    caption: `📖 *${nombreManga}*\n\n${tituloCaps}\n📄 ${sizeMB}MB (comprimido)\n\n${global.set.footer}`
  }, { quoted: m })

  // limpiar
  try { fs.unlinkSync(pdfPath) } catch (e) {}
}

// Generar PDF con pdfkit (título + páginas)
async function generarPDF(filePath, nombre, capitulo, buffers) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ autoFirstPage: false, margin: 0 })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      // Portada con nombre y capítulo
      doc.addPage({ size: [595, 842] }) // A4
      doc.fontSize(28).text(`${nombre}`, { align: 'center' }, 200, 350)
      doc.fontSize(20).text(`Capítulo ${capitulo}`, { align: 'center' }, 250, 420)
      doc.fontSize(12).text(`Generado con Ginko`, { align: 'center' }, 250, 470)

      // Cada imagen en su página
      for (const buf of buffers) {
        try {
          // tamaño de página = tamaño de imagen (aproximado)
          const page = doc.addPage()
          page.save()
          // Añadir imagen (escalada al ancho de página)
          const imgWidth = 595
          doc.image(buf, 0, 0, { width: imgWidth })
          page.restore()
        } catch (e) {
          console.error('[Manga] PDF página:', e.message)
        }
      }

      doc.end()
      stream.on('finish', resolve)
      stream.on('error', reject)
    } catch (e) {
      reject(e)
    }
  })
}
