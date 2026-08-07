/*  [ Info Command ]
 *  Ginko - JADIBOT (sub-bots)
 *  Permite que otro usuario "se vuelva bot": se crea una sesión Baileys secundaria
 *  y se le entrega un código de emparejamiento (pairing code) para su número.
 *  Detener con:  .jadibot stop   (solo owner)
 */
import baileys from "../../system/lib/baileys.js"
import pino from "pino"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const subs = {} // m.sender -> { sock, timer }

export default {
  name: 'jadibot',
  tags: 'owner',
  command: ['jadibot', 'subbot', 'sessionbot'],
  description: 'Genera un código para que otro número sea un sub-bot',
  example: 'jadibot [número]  → para detener: jadibot stop',
  run: async (m, { sock, text }) => {
    // Detener
    if (text && text.toLowerCase().includes('stop')) {
      if (subs[m.sender]) {
        try { subs[m.sender].sock.end('Detenido por el usuario') } catch (e) {}
        clearTimeout(subs[m.sender].timer)
        delete subs[m.sender]
        return m.reply('🛑 *Sub-bot detenido.*')
      }
      return m.reply('No hay ningún sub-bot activo para tu número.')
    }

    if (subs[m.sender]) return m.reply('⏳ Ya tienes un sub-bot en proceso. Envía `.jadibot stop` para detenerlo.')

    // Número de destino (si no se da, usa el número del propio usuario)
    let number = text.replace(/[^0-9]/g, '')
    if (!number) number = m.sender.split('@')[0]
    if (number.length < 8) return m.reply('❌ Número inválido.')

    m.reply('⏳ *Espera un momento, estoy generando tu código de vinculación para tu número...*\n\n> 🔄 *Iniciando sesión de Sub-Bot...*')

    try {
      const logger = pino({ level: 'silent' })
      const { state, saveCreds } = await baileys.useMultiFileAuthState(`./storage/temp/subbot_${m.sender.split('@')[0]}`)
      const subSock = baileys.default({
        logger,
        printQRInTerminal: false,
        auth: { creds: state.creds, keys: state.keys },
      })

      subs[m.sender] = { sock: subSock }

      subSock.ev.on('creds.update', saveCreds)

      // Solicitar código de emparejamiento
      if (!subSock.authState.creds.registered) {
        let code = await subSock.requestPairingCode(number)
        code = code?.match(/.{1,4}/g)?.join('-') || code

        const teks = `*🪄 JADIBOT - CÓDIGO DE VINCULACIÓN*\n\n`
          + `Tu código es:\n\`${code}\`\n\n`
          + `*Pasos para vincular:*\n`
          + `1. Abre WhatsApp en tu celular.\n`
          + `2. Toca en los tres puntos (Menú) o Configuración.\n`
          + `3. Selecciona "Dispositivos vinculados".\n`
          + `4. Toca "Vincular un dispositivo" y luego "Vincular con el número de teléfono".\n`
          + `5. Ingresa el código de arriba.\n\n`
          + `> Para detener tu bot más tarde, envía: .jadibot stop`

        m.reply(teks)
      }

      // Auto-apagado tras 5 minutos si no se vincula
      subs[m.sender].timer = setTimeout(() => {
        try { subs[m.sender]?.sock.end('Tiempo agotado') } catch (e) {}
        delete subs[m.sender]
      }, 5 * 60 * 1000)

    } catch (e) {
      console.error('[JADIBOT] Error:', e)
      delete subs[m.sender]
      throw '❌ Error al crear el sub-bot. Revisa el número o intenta de nuevo.'
    }
  }
}
