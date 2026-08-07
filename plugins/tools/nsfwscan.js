/*  [ Info Command ]
 *  Ginko - NSFW Scanner
 *  Clasifica una imagen (respondida o enviada con el comando) en 5 categorías
 *  usando el modelo NSFWJS (TensorFlow.js): Neutral, Drawing, Hentai, Porn, Sexy.
 *
 *  Requiere instalar:  npm i nsfwjs @tensorflow/tfjs-node jimp
 *  El modelo se descarga la primera vez (approx 5 MB) y se cachea en /storage/nsfw-model
 */
import * as tf from "@tensorflow/tfjs-node"
import * as nsfwjs from "nsfwjs"
import jimp from "jimp"
import fs from "fs"

// Carga única (singleton) del modelo
let model = null
async function getModel() {
  if (model) return model
  try {
    model = await nsfwjs.load("file://./storage/nsfw-model/")
  } catch (e) {
    // Si no hay modelo local, intenta descargarlo en el primer uso
    console.log("[NSFW] Descargando modelo local...")
    model = await nsfwjs.load()
  }
  return model
}

export default {
  name: 'nsfwscan',
  tags: 'tools',
  command: ['nsfw', 'nsfwscan', 'scanimg'],
  description: 'Analiza una imagen y devuelve el % de contenido (NSFW Scanner)',
  example: 'responde a una imagen o envía una con el comando',
  run: async (m, { sock }) => {
    // Obtener la imagen (respondida o adjunta en el mismo mensaje)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) throw `❌ *Responde a una imagen o envía una foto* con el comando ${m.prefix}nsfw`

    let media = await q.download()
    if (!media) throw '❌ No pude descargar la imagen.'

    m.reply('🔍 *Analizando imagen...*')

    try {
      const mdl = await getModel()
      const image = await jimp.read(media)
      const buffer = await image.getBufferAsync(jimp.MIME_JPEG)
      const predictions = await mdl.classify(buffer)

      // Ordenar y construir el reporte en el estilo de las capturas
      const orden = { Neutral: 0, Drawing: 1, Hentai: 2, Porn: 3, Sexy: 4 }
      const data = predictions.sort((a, b) => orden[a.className] - orden[b.className])

      let teks = `*NSFW SCANNER*\n`
      teks += `╭━━━━━━━━━━━━━━\n`
      for (const p of data) {
        const pct = (p.probability * 100).toFixed(1)
        teks += `│ ${p.className}: ${pct}%\n`
      }
      teks += `╰━━━━━━━━━━━━━━\n`

      // Veredicto (umbral por defecto: riesgo si hentai+porn+sexy supera 25%)
      const riesgo =
        (data.find(x => x.className === 'Hentai')?.probability || 0) +
        (data.find(x => x.className === 'Porn')?.probability || 0) +
        (data.find(x => x.className === 'Sexy')?.probability || 0)

      teks += `\n> *Veredicto:* ${riesgo > 0.25 ? '⚠️ CONTENIDO SENSIBLE' : '✅ WA SEGURO'}\n`
      teks += `> *Motor:* NSFWJS (TensorFlow.js)\n`
      teks += global.set.footer
      m.reply(teks)
    } catch (e) {
      console.error('[NSFW] Error:', e)
      throw '❌ Error al analizar la imagen. ¿Tienes instalado `nsfwjs`, `@tensorflow/tfjs-node` y `jimp`?'
    }
  }
}
