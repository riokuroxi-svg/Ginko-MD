/*  [ Ginko - Script de ofuscación ]
 *  Ofusca los plugins valiosos para el repositorio público.
 *
 *  USO:
 *   node ofuscar.js              → ofusca los plugins configurados
 *   node ofuscar.js --list       → lista los plugins que se ofuscan
 *
 *  CÓMO FUNCIONA:
 *   1. Lee el plugin original (ej: plugins/download/manga.js)
 *   2. Lo ofusca con javascript-obfuscator
 *   3. Sobrescribe el archivo con la versión ofuscada
 *
 *  ⚠️ IMPORTANTE: guarda siempre el código ORIGINAL en el repo privado
 *     (Ginko-Source). Este script SOLO se usa antes de subir al repo público.
 */
const JavaScriptObfuscator = require('javascript-obfuscator')
const fs = require('fs')
const path = require('path')

// Plugins valiosos a ofuscar (lista blanca)
const PLUGINS_A_OFUSCAR = [
  'plugins/download/manga.js',
  'plugins/download/play.js',
  'plugins/download/tiktok.js',
  // Añade aquí más plugins valiosos si quieres
]

function ofuscarArchivo(archivo) {
  const fullPath = path.resolve(archivo)
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ No existe: ${archivo}`)
    return false
  }

  const code = fs.readFileSync(fullPath, 'utf-8')

  // Configuración de ofuscación (compatible con ESM)
  const resultado = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: false,      // evitar romper ESM
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,          // NO renombrar globales (import/export)
    selfDefending: false,          // evitar auto-detección que rompe
    stringArray: true,
    stringArrayThreshold: 0.5,
    target: 'node',                // orientado a Node.js
  }).getObfuscatedCode()

  // Escribir la versión ofuscada
  fs.writeFileSync(fullPath, resultado)
  console.log(`✅ Ofuscado: ${archivo}`)
  return true
}

// --- MAIN ---
const args = process.argv.slice(2)
if (args.includes('--list')) {
  console.log('Plugins a ofuscar:')
  PLUGINS_A_OFUSCAR.forEach(p => console.log('  • ' + p))
  process.exit(0)
}

console.log('🔒 Ofuscando plugins valiosos...')
let count = 0
for (const p of PLUGINS_A_OFUSCAR) {
  if (ofuscarArchivo(p)) count++
}
console.log(`\n✅ ${count} plugins ofuscados.`)
console.log('⚠️ Recuerda: el código original está en Ginko-Source (privado).')
console.log('⚠️ Si necesitas cambiar algo, edita desde Ginko-Source y re-ofusca.')
