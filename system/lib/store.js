/*  [ Ginko - In-Memory Store shim ]
 *  Reemplazo de baileys.makeInMemoryStore (que venía del fork k-evolution).
 *  Proporciona la API mínima que usa system/main.js:
 *    - loadMessage(jid, id)
 *    - bind(ev)  /  deserialize
 *    - contacts, groupMetadata (objetos mapa)
 *    - readFromFile(path) / writeToFile(path)
 */

class InMemoryStore {
  constructor() {
    this.messages = {}       // jid -> { id -> msg }
    this.contacts = {}       // id -> { id, name }
    this.groupMetadata = {}  // id -> metadata
    this.write_store = false
    this._ev = null
  }

  // ----- Persistencia opcional (JSON simple) -----
  async readFromFile(path) {
    try {
      const fs = (await import("fs")).default
      if (!fs.existsSync(path)) return
      const data = JSON.parse(fs.readFileSync(path, "utf-8"))
      if (data.contacts) this.contacts = data.contacts
      if (data.groupMetadata) this.groupMetadata = data.groupMetadata
    } catch (e) {
      /* ignorar */
    }
  }

  async writeToFile(path, force = false) {
    if (!this.write_store && !force) return
    const fs = (await import("fs")).default
    fs.writeFileSync(path, JSON.stringify({ contacts: this.contacts, groupMetadata: this.groupMetadata }, null, 2))
  }

  // ----- Carga de mensajes -----
  async loadMessage(jid, id) {
    const msg = this.messages[jid]?.[id]
    if (!msg) return null
    return msg
  }

  // ----- Vincular eventos del socket -----
  bind(ev) {
    this._ev = ev
    ev.on("messages.upsert", (m) => this._onMessages(m))
  }

  _onMessages({ messages }) {
    for (const msg of messages || []) {
      const jid = msg.key?.remoteJid
      const id = msg.key?.id
      if (!jid || !id) continue
      if (!this.messages[jid]) this.messages[jid] = {}
      this.messages[jid][id] = msg
      // Limitar memoria (mantener últimos 500 por chat)
      const keys = Object.keys(this.messages[jid])
      if (keys.length > 500) {
        delete this.messages[jid][keys[0]]
      }
    }
  }

  // Mantener compatibilidad si alguien llama store.deserialize
  async deserialize() {
    return null
  }
}

export default InMemoryStore
