/*  [ Ginko - Efectos de audio ]
 *  Aplica efectos de voz a un audio/video usando FFmpeg local.
 *  Uso: responde a un audio/video con .fx <efecto>
 *  Efectos: grave, lento, rapido, chipmunk (agudo), eco, robot, vibrato
 */
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execP = promisify(exec)

const fxMap = {
  grave: ['-af', 'asetrate=44100*0.7,aresample=44100,atempo=1.0'],
  lento: ['-filter:a', 'atempo=0.7'],
  rapido: ['-filter:a', 'atempo=1.5'],
  rapido2: ['-filter:a', 'atempo=2.0'],
  chipmunk: ['-af', 'asetrate=44100*1.5,aresample=44100,atempo=1.0'],
  agudo: ['-af', 'asetrate=44100*1.3,aresample=44100,atempo=1.0'],
  eco: ['-af', 'aecho=0.8:0.9:500|1000:0.3|0.25'],
  robot: ['-af', 'asetrate=44100*0.8,aresample=44100,atempo=1.1,chorus=0.7:0.9:55:0.4:0.25:2'],
  vibrato: ['-af', 'vibrato=f=5:d=0.6'],
}

export default {
  name: 'audiofx',
  tags: 'convert',
  command: ['fx', 'audiofx', 'voz'],
  description: 'Aplica efectos de voz (grave, lento, rapido, chipmunk, eco, robot, vibrato)',
  example: 'fx grave',
  run: async (m, { sock, text }) => {
    const fx = (text || '').toLowerCase().trim()
    const conf = fxMap[fx]
    if (!conf) throw `❌ Efecto no válido. Usa: ${Object.keys(fxMap).join(', ')}\nEjemplo: ${m.prefix}fx grave (respondiendo a un audio/video)`

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/audio|video/.test(mime)) throw `❌ Responde a un *audio o video* con ${m.prefix}fx ${fx}`

    m.reply('🎧 *Aplicando efecto...*')
    let media = await q.download()
    if (!media) throw '❌ No pude descargar el audio.'

    const tmpIn = `./storage/temp/fx_${Date.now()}.${/video/.test(mime) ? 'mp4' : 'mp3'}`
    const tmpOut = `./storage/temp/fx_out_${Date.now()}.${/video/.test(mime) ? 'mp4' : 'mp3'}`
    fs.writeFileSync(tmpIn, media)

    try {
      await execP(`ffmpeg -y -i "${tmpIn}" ${conf.join(' ')} "${tmpOut}"`)
      if (!fs.existsSync(tmpOut)) throw 'no-output'
      const outBuffer = fs.readFileSync(tmpOut)
      await sock.sendMessage(m.chat, { audio: outBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
    } catch (e) {
      console.error('[AudioFX]', e)
      throw '❌ Error al procesar el audio (¿FFmpeg instalado?).'
    } finally {
      try { fs.unlinkSync(tmpIn) } catch (e) {}
      try { fs.unlinkSync(tmpOut) } catch (e) {}
    }
  }
}
