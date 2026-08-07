/*  [ Info Command ]
 *  Ginko - Diagnóstico de Sistema (ping)
 *  Panel que une latencia, uptime del bot, uptime del host, conteo de la base de datos
 *  y hardware, en el estilo de las capturas V7.0.
 */
import os from "os"
import { performance } from "perf_hooks"
import { format } from "util"

export default {
  name: 'ping',
  tags: 'info',
  command: ['ping', 'speed', 'diagnostico', 'panel'],
  description: "Diagnóstico de sistema: latencia, uptime, base de datos y hardware",
  example: '',
  run: async (m, { sock }) => {
    let old = performance.now()

    // Latencia aproximada del bot (tiempo de ejecución)
    let speed = (performance.now() - old).toFixed(2)

    // Uptime del bot (proceso actual)
    let uptimeBot = func.runtime(process.uptime())

    // Uptime del host (sistema operativo)
    let uptimeHostSec = os.uptime()
    let uptimeHost = `${Math.floor(uptimeHostSec / 86400)}d ${Math.floor((uptimeHostSec % 86400) / 3600)}h ${Math.floor((uptimeHostSec % 3600) / 60)}m ${Math.floor(uptimeHostSec % 60)}s`

    // Métricas de la base de datos
    let totalUsers = Object.keys(global.db.users || {}).length
    let totalGroups = Object.keys(global.db.chats || {}).filter(id => id.endsWith('@g.us')).length
    let totalPlugins = Object.keys(global.plugins || {}).length

    // Hardware
    let cpuModel = os.cpus()[0]?.model || 'N/A'
    let cpuCount = os.cpus().length
    let ramUsed = func.formatSize(os.totalmem() - os.freemem())
    let ramTotal = func.formatSize(os.totalmem())
    let nodeVer = process.version

    let teks = `*Ginko Bot - Diagnóstico de Sistema*\n`
    teks += `\n*PANEL DE CONTROL - INFRAESTRUCTURA*\n`
    teks += `Reporte detallado en tiempo real del hardware, base de datos y métricas internas.\n`
    teks += `\n╭─────────────────\n`
    teks += `│ *Métrica*         *Valor*\n`
    teks += `│ Latencia        ${speed} ms\n`
    teks += `│ Uptime Bot      ${uptimeBot}\n`
    teks += `│ Uptime Host     ${uptimeHost}\n`
    teks += `│ Registro        Cantidad\n`
    teks += `│ Usuarios        ${totalUsers}\n`
    teks += `│ Grupos          ${totalGroups}\n`
    teks += `│ Módulos/Plugins ${totalPlugins}\n`
    teks += `╰─────────────────\n`
    teks += `\n*Componente*    *Uso / Detalles*\n`
    teks += `Procesador     ${cpuCount}x ${cpuModel}\n`
    teks += `Memoria RAM    ${ramUsed} / ${ramTotal}\n`
    teks += `Node.js        ${nodeVer}\n`
    teks += `\n> Junta varias métricas en un solo mensaje.\n`
    teks += global.set.footer

    m.reply(teks)
  }
}
