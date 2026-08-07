import fs from 'fs'
import axios from 'axios'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import chalk from "chalk"
import { fileURLToPath } from "url"
import Function from "../system/lib/function.js"
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)  

/** settings number **/
// ⚠️ CAMBIA ESTE NÚMERO por el tuyo (formato: codigopais + número, SIN + ni espacios)
global.owner = ["5215574370309"]
global.pairingNumber = "Your_Number" // ⚠️ PON AQUÍ el número que usará el bot (ej: 593xxxxxxxxx)
global.write_store = false

/** function to make it more practical **/
global.Func = await new (await import('../storage/script/functions.js')).default();
global.Uploader = await new (await import('../storage/script/uploader.js')).default();
global.UploaderV2 = (await import('../storage/script/uploaderV2.js')).default
global.scrap = await import('../storage/script/scraper.js')

/** tools **/
global.fs = fs
global.axios = axios
global.cheerio = cheerio
global.fetch = fetch
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.readMore = readMore

global.multiplier = 1000 // Cuanto más grande se vuelve, más difícil es subir de nivel.
global.max_upload = 70 // Límite máximo para enviar archivos
global.intervalmsg = 1800 // Para evitar el spam en el primer inicio de sesión
global.ram_usage = 2100000000 // Máximo 2 GB de RAM, haz el cálculo tú mismo

global.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i
global.thumbnail = fs.readFileSync("./storage/media/thumbnail.jpg")
global.timeImage = Function.timeImage()
global.ucapan = Function.timeSpeech()
global.func = Function

/** apikey **/
global.ssa = 'https://api.ssateam.my.id'
global.key = 'isiajasendiri'

global.APIs = {
  ssa: 'https://api.ssateam.my.id',
  ana: 'https://anabot.my.id',
  dlr: 'http://144.126.156.179'
}

global.APIKeys = {
  'https://anabot.my.id/api': key
}

/** don't remove **/
global.opts = {
  qr: false,
  pairing: true
}

/** options setting **/  
global.set = {
  wm: `© Ginko v1.0.0`,
  footer: 'Powered By Ginko',
  version: 'v1.0.0',
  packname: 'Sticker By Ginko',
  author: '© Ginko'
}

/** canal aqui **/
global.ch = {
  ssa: '120363301101357890@newsletter',
  ssaclone: '120363301101357890@newsletter'
}

/** hacer galletas/api scraper aquí **/
global.mangaPrecio = 5000 // 💰 Costo por rango de 10 capítulos de manga (0 = gratis). Puedes cambiarlo aquí
global.api = {
  gemini: process.env.GEMINI_API_KEY || 'PON_TU_KEY_GEMINI_AQUI', // ⚠️ Key de Gemini (NO subir a GitHub público)
  useragent: 'Mozilla/5.0 (Linux; Android 10; SM-A105G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
  bing: ''
}

/** opciones de redes sociales **/  
// ⚠️ CAMBIA estas redes a las tuyas (son las que aparecen en menú/creditos)
global.media = {
  sig: 'https://www.instagram.com/__ikg.05',
  syt: 'https://www.instagram.com/__ikg.05',
  sgh: 'https://www.instagram.com/__ikg.05',
  sch: 'https://whatsapp.com/channel/IKG',
  sr: '',
  swa: 'https://wa.me/5215574370309',
  scm: '120363301101357890@newsletter' // identificación comunitaria, requerida
}

/** configuración tu miniatura está aquí **/
global.thumb = 'https://telegra.ph/file/7c56992ce2631432d3435.jpg'
global.thumb2 = 'https://telegra.ph/file/51dbbb9a1e71a021ee457.jpg'

/** mensajes de estado **/
global.status = Object.freeze({
  wait: Func.texted('bold', 'Procesando la solicitud. . .'),
  invalid: Func.texted('bold', 'URL invalida!'),
  wrong: Func.texted('bold', 'Formato incorrecto!'),
  getdata: Func.texted('bold', 'Scraping metadatos . . .'),
  fail: Func.texted('bold', 'No pude obtener metadatos!'),
  error: Func.texted('bold', 'Ocurrió un error!'),
  errorF: Func.texted('bold', 'Lo siento, esta característica está dando un error.'),
  premium: Func.texted('bold', 'Esto solo es para usuarios premiums.'),
  limit: Func.texted('bold', 'Su límite de prueba se ha agotado, no podrá acceder a algunos comandos temporalmente. '),
  owner: Func.texted('bold', 'Este comando es sólo para propietarios.'),
  god: Func.texted('bold', 'Este comando es solo para el propietario.'),
  group: Func.texted('bold', 'Este comando solo funcionará en grupos.'),
  botAdmin: Func.texted('bold', 'Este comando funcionará cuando me convierta en administrador.'),
  admin: Func.texted('bold', 'Este comando es sólo para administradores de grupo.'),
  restrict: Func.texted('bold', 'Este comando está deshabilitado.'),
  private: Func.texted('bold', 'Utilice este comando en el chat privado.'),
  reg: Func.texted('bold', 'Hola, regístrese primero para utilizar esta función.\nEscribe .reg nombre.edad\nEjemplo .reg c.17'),
  quoted: Func.texted('bold', 'Responder un mensaje'),
  image: Func.texted('bold', 'Responde una foto o envia una foto con el comando'),
  sticker: Func.texted('bold', 'Responde un sticker'),
  video: Func.texted('bold', 'Responde a un video o envia un video con el comando'),
  audio: Func.texted('bold', 'Responde a un audio')
})

/** no lo cambies **/
global.adReply = {
  contextInfo: {
    externalAdReply: {
      title: set.wm,
      body: ucapan,
      description: set.author,
      previewType: "PHOTO",
      thumbnail: thumbnail,
      mediaUrl: media.sig,
      sourceUrl: media.sig
    }
  }
}

/** realod file **/
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update config.js"))
  import(`${file}?update=${Date.now()}`)
})
