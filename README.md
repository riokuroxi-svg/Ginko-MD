<p align="center">
<img src="./assets/bocchi-banner.png" alt="Bocchi banner" width="100%"/>
</p>

<h1 align="center">🍁 Ginko-MD</h1>
<h3 align="center">Bot de WhatsApp Multi-Device — Estable, rápido y multifuncional</h3>

<p align="center">
<a href="https://github.com/riokuroxi-svg/Ginko-MD/stargazers/"><img title="Estrellas" src="https://img.shields.io/github/stars/riokuroxi-svg/Ginko-MD?color=e11d48&style=for-the-badge&logo=github"></a>
<a href="https://github.com/riokuroxi-svg/Ginko-MD/network/members"><img title="Forks" src="https://img.shields.io/github/forks/riokuroxi-svg/Ginko-MD?color=f97316&style=for-the-badge&logo=github"></a>
<a href="https://github.com/riokuroxi-svg/Ginko-MD/issues"><img title="Issues" src="https://img.shields.io/github/issues/riokuroxi-svg/Ginko-MD?color=eab308&style=for-the-badge&logo=github"></a>
<img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs">
<img src="https://img.shields.io/badge/Baileys-MD-25D366?style=for-the-badge&logo=whatsapp">
</p>

<p align="center">
  <sub>🍁 IG: <a href="https://instagram.com/__ikg.05">@__ikg.05</a></sub>
</p>

---

## 📖 Descripción
Ginko-MD es un bot para WhatsApp Multi-Device construido sobre WaSocket/Baileys. Tiene todas las funciones que necesitas: descargas de música y videos, stickers, juegos de gacha, sistema de economía, gestión completa de grupos, comandos de IA, anti-enlaces, bienvenidas y mucho más. Funciona perfectamente en **Termux (Android)**, VPS Linux y paneles Pterodactyl/BoxMine.

---

## ✨ Características principales
| 📂 Categoría | Funciones disponibles |
|---|---|
| 📥 **Descargas** | YouTube (audio 320kbps / video), TikTok, Instagram, Facebook, Twitter/X, Pinterest, Mediafire, Google Drive, APKs |
| 🎨 **Stickers** | Crea stickers desde imagen/video, stickers con texto, packs de stickers, metadata personalizada |
| 👥 **Grupos** | Kick / add / promover / degradar admins, anti-enlaces, mensajes de bienvenida, anti-eliminar mensajes |
| 🎮 **Juegos y economía** | Sistema de gacha/waifus, monedas, niveles/experiencia, dado, moneda |
| 🤖 **IA y utilidades** | Chat con IA, traductor automático, texto a voz, búsqueda de imágenes, creador de códigos QR |
| 🛡️ **Estabilidad** | Auto-reconexión, código de vinculación de 8 dígitos, anti-ban, no se cae por errores en comandos |

---

---

## 🚀 Instalación

### 📱 Método 1: Termux (Android)
**Copia y pega estos comandos UNO POR UNO en Termux, no te saltes ninguno:**

#### Paso 1: Dar permiso de almacenamiento
```bash
termux-setup-storage
```
*Acepta el permiso cuando aparezca la ventana.*

#### Paso 2: Actualizar paquetes e instalar dependencias del sistema
```bash
apt update && apt upgrade -y
pkg install -y git nodejs-lts ffmpeg imagemagick
```
*Si te pregunta algo durante la instalación, escribe `y` y presiona ENTER.*

#### Paso 3: Clonar el repositorio de Ginko-MD
```bash
git clone https://github.com/riokuroxi-svg/Ginko-MD.git
```

#### Paso 4: Entrar a la carpeta del bot
```bash
cd Ginko-MD
```

#### Paso 5: Instalar dependencias de Node.js
```bash
npm install --no-audit --no-fund
```
*Espera que termine, puede tardar de 2 a 5 minutos.*

#### Paso 6: Configurar tu número (dueño del bot)
Abre el archivo de configuración:
```bash
nano settings.js
```
Busca la línea que dice:
```js
global.owner = ['525574370309'];
```
Cambia el número por tu número de teléfono (solo dígitos, sin `+`, sin espacios, con código de país). Por ejemplo, si eres de México es `52` seguido de tu número.

Guarda el archivo:
1. Presiona `Ctrl + O`
2. Presiona `ENTER`
3. Presiona `Ctrl + X`

#### Paso 7: Arrancar el bot por primera vez
```bash
npm start
```
- Cuando aparezca el menú de opciones, elige la opción `2` para usar código de 8 dígitos.
- Ingresa el número del bot con código de país cuando te lo pida.
- Copia el código de vinculación que aparece en pantalla y ponlo en WhatsApp:
  > Ajustes → Dispositivos vinculados → Vincular un dispositivo → Vincular con número de teléfono

✅ ¡Listo! El bot estará conectado.

---

### ☁️ Método 2: VPS Linux (Ubuntu/Debian)
```bash
# Actualizar sistema
apt update && apt upgrade -y
apt install -y git nodejs npm ffmpeg imagemagick

# Clonar repo
git clone https://github.com/riokuroxi-svg/Ginko-MD.git
cd Ginko-MD
npm install --no-audit --no-fund

# Edita tu número de dueño
nano settings.js

# Arrancar
npm start
```

---

### 🟢 Dejar el bot corriendo en segundo plano (PM2)
Para que no se apague cuando cierres Termux o la terminal:
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Solo para Termux: mantener la aplicación encendida
termux-wake-lock

# Iniciar el bot en segundo plano
pm2 start index.js --name ginko
pm2 save
```

| Acción | Comando |
|---|---|
| Ver logs en tiempo real (lo que está pasando) | `pm2 logs ginko` |
| Parar el bot | `pm2 stop ginko` |
| Reiniciar el bot | `pm2 restart ginko` |
| Eliminar el proceso de PM2 | `pm2 delete ginko` |
| Ver estado del bot | `pm2 status` |

---

## 🔄 Solución de problemas comunes

### Si se cortó el internet o se apagó el bot
Solo vuelve a entrar a la carpeta y arráncalo de nuevo:
```bash
cd ~/Ginko-MD && npm start
```

### Volver a vincular de cero (cambiar de número)
Si quieres borrar la sesión actual y vincular otro número:
```bash
cd ~/Ginko-MD
rm -rf Sessions/Owner
npm start
```

### Error "no se encontró el módulo" o dependencias rotas
Vuelve a instalar los paquetes:
```bash
cd ~/Ginko-MD
rm -rf node_modules package-lock.json
npm install --no-audit --no-fund
```

### El código de vinculación no aparece o da error
Asegúrate de que el número del bot esté escrito correctamente (solo dígitos, con código de país, sin `+` ni espacios). Si sigue fallando, borra la sesión con el comando de arriba y vuelve a arrancar.

---

## 📝 Cómo usar el bot
El prefijo por defecto es el **punto** (`.`). Algunos comandos básicos:
| Comando | Qué hace |
|---|---|
| `.play <canción>` | Descarga música de YouTube |
| `.mp4 <video>` | Descarga video de YouTube |
| `.menu` | Muestra la lista completa de comandos |
| `.sticker` | Convierte una imagen/video en sticker al responderla |
| `.ping` | Muestra la velocidad de respuesta del bot |

Puedes cambiar el prefijo o cualquier otra configuración editando el archivo `settings.js`.

---

## 📁 Estructura del proyecto
```
Ginko-MD/
├── assets/             # Imágenes y recursos
├── cmds/               # Todos los comandos del bot (por categorías)
│   ├── downloads/      # Comandos de descarga (ytmp3, tiktok, ig, fb...)
│   ├── group/          # Comandos de administración de grupos
│   ├── gacha/          # Sistema de gacha, waifus y economía
│   ├── main/           # Comandos básicos: menú, help, ping
│   ├── stickers/       # Creador de stickers
│   └── utils/          # Utilidades: IA, traductor, imágenes
├── core/               # Lógica interna (conexión a WA, base de datos)
├── Sessions/           # Aquí se guarda tu sesión de WhatsApp (no borrar si no quieres volver a vincular)
├── tmp/                # Archivos temporales que se borran automáticamente
├── index.js            # Punto de entrada del bot y banner
├── main.js             # Router y manejador de comandos
├── settings.js         # Archivo de CONFIGURACIÓN PRINCIPAL (tu número, ajustes)
└── package.json        # Dependencias
```

---

## ⚠️ Aviso importante
Este proyecto es para fines educativos y uso personal. El uso de bots de WhatsApp puede violar los Términos de Servicio de WhatsApp. Usa este bot bajo tu propia responsabilidad. No nos hacemos responsables por baneos o suspensiones de cuenta.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-%F0%9F%8D%81-orange?style=flat-square">
  <br>
  <sub>🍁 Ginko-MD — 2025-2026</sub>
</p>
