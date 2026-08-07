/*  [ Ginko - Baileys compat shim ]
 *  La base (Soky-Plugins) usaba el fork 'kiuur/k-evolution' de Baileys, donde se podía
 *  hacer `import baileys from "@whiskeysockets/baileys"` y acceder a todo como
 *  propiedades del default (baileys.makeWASocket, baileys.useMultiFileAuthState, ...).
 *  El Baileys oficial expone todo como exportaciones nombradas. Este shim replica el
 *  comportamiento del fork para que el código funcione sin más cambios.
 */
import * as B from "@whiskeysockets/baileys"
import InMemoryStore from "./store.js"

// Objeto con todas las exportaciones nombradas + default makeWASocket
const baileys = { ...B }
baileys.default = B.makeWASocket

// makeInMemoryStore no existe en el Baileys oficial (venía del fork k-evolution)
baileys.makeInMemoryStore = () => new InMemoryStore()

// PHONENUMBER_MCC no viene exportado en el Baileys oficial. Mapa parcial de códigos de país
// (usado solo para validar el prefijo del número de emparejamiento).
baileys.PHONENUMBER_MCC = {
  '1': 'US', '52': 'MX', '54': 'AR', '55': 'BR', '56': 'CL', '57': 'CO',
  '58': 'VE', '51': 'PE', '593': 'EC', '34': 'ES', '39': 'IT', '49': 'DE',
  '44': 'GB', '33': 'FR', '91': 'IN', '86': 'CN', '81': 'JP', '82': 'KR',
  '55': 'BR', '595': 'PY', '598': 'UY', '502': 'GT', '503': 'SV', '504': 'HN',
  '505': 'NI', '506': 'CR', '507': 'PA', '509': 'DO', '53': 'CU', '51': 'PE'
}

// Alias/funciones que solo existían en el fork k-evolution y no en el oficial.
// Estos se importan por compatibilidad en serialize.js pero no se usan en el cuerpo.
baileys._makeWaSocket = B.makeWASocket
baileys.makeWALegacySocket = B.makeWASocket
baileys.MessageType = { text: 'conversation', image: 'imageMessage', video: 'videoMessage', audio: 'audioMessage', sticker: 'stickerMessage' }
baileys.Mimetype = { jpeg: 'image/jpeg', png: 'image/png', mp4: 'video/mp4', webp: 'image/webp', mp3: 'audio/mpeg', ogg: 'audio/ogg; codecs=opus' }

export default baileys
