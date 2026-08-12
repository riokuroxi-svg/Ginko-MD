<h1 align="center">🍁 Ginko-MD</h1>
<h3 align="center">Bot de WhatsApp Multi-Device — Estable, rápido y multifuncional</h3>

<p align="center">
<a href="https://github.com/riokuroxi-svg/Ginko-MD/stargazers/"><img title="Estrellas" src="https://img.shields.io/github/stars/riokuroxi-svg/Ginko-MD?color=e11d48&style=for-the-badge&logo=github"></a>
<a href="https://github.com/riokuroxi-svg/Ginko-MD/network/members"><img title="Forks" src="https://img.shields.io/github/forks/riokuroxi-svg/Ginko-MD?color=f97316&style=for-the-badge&logo=github"></a>
<a href="https://github.com/riokuroxi-svg/Ginko-MD/issues"><img title="Issues" src="https://img.shields.io/github/issues/riokuroxi-svg/Ginko-MD?color=eab308&style=for-the-badge&logo=github"></a>
<img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs">
<img src="https://img.shields.io/badge/Baileys-MD-25D366?style=for-the-badge&logo=whatsapp">
</p>


---

## 📖 Descripción
Ginko-MD es un bot para WhatsApp Multi-Device construido sobre Baileys/WaSocket. Tiene todas las funciones que necesitas: descargas de música y videos, stickers, juegos, sistema de economía, gestión de grupos, comandos de IA y mucho más. Funciona perfectamente en Termux (Android), VPS Linux, paneles Pterodactyl/BoxMine y servidores en la nube.

---

## ✨ Características principales
| Categoría | Funciones |
|---|---|
| 📥 **Descargas** | YouTube (audio y video), TikTok, Instagram, Facebook, Twitter/X, Pinterest, Mediafire, Google Drive |
| 🎨 **Stickers** | Crea stickers desde imagen/video, stickers con texto, pack de stickers |
| 👥 **Grupos** | Kick/add/promote/demote, anti-enlaces, mensajes de bienvenida/despedida, anti-eliminar mensajes |
| 🎮 **Juegos** | Sistema de gacha/waifus, economía/monedas, niveles/experiencia, dado/moneda |
| 🤖 **IA** | Chat con IA, traductor automático, texto a voz |
| 🔧 **Utilidades** | Clonar repositorios, perfil de usuario, búsqueda de imágenes, creador de QR |
| 🛡️ **Estabilidad** | Auto-reconexión, código de vinculación de 8 dígitos, no se cae por errores en comandos, anti-ban |

---

## 🚀 Instalación

### 📱 Método 1: Termux (Android)
Ejecuta estos comandos **uno por uno** en la aplicación de Termux:
```bash
# 1. Dar permiso de almacenamiento
termux-setup-storage

# 2. Instalar dependencias del sistema
apt update && apt upgrade -y
pkg install -y git nodejs ffmpeg imagemagick

# 3. Clonar el repositorio
git clone https://github.com/riokuroxi-svg/Ginko-MD.git

# 4. Entrar a la carpeta del bot
cd Ginko-MD

# 5. Instalar dependencias de Node
npm install --no-audit --no-fund

# 6. Configurar tu número de dueño
# Edita la línea global.owner en settings.js y pon tu número (sin + ni espacios, ejemplo México: 525574370309)
nano settings.js

# 7. Arrancar el bot
npm start
```

> 💡 Si durante la instalación te aparece el mensaje `(Y/I/N/O/D/Z) [default=N] ?` escribe la letra `y` y presiona ENTER para continuar.

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

# Editar tu número de dueño
nano settings.js

# Arrancar
npm start
```

---

### 🟢 Método 3: Dejarlo corriendo en segundo plano (PM2)
Para que no se apague cuando cierres Termux/la terminal:
```bash
# Instalar PM2
npm install -g pm2

# (Solo Termux) Mantener Termux encendido
termux-wake-lock

# Iniciar el bot en segundo plano
pm2 start index.js --name ginko
pm2 save
```

Comandos útiles de PM2:
| Acción | Comando |
|---|---|
| Ver logs en tiempo real | `pm2 logs ginko` |
| Parar el bot | `pm2 stop ginko` |
| Reiniciar el bot | `pm2 restart ginko` |
| Eliminar el proceso | `pm2 delete ginko` |

---

## 🔄 Solución de problemas comunes
### Si se corta el internet o se apaga el bot
Solo vuelve a entrar a la carpeta y arráncalo de nuevo:
```bash
cd ~/Ginko-MD && npm start
```

### Volver a vincular de cero / cambiar de número
Si quieres borrar la sesión actual y vincular un número nuevo:
```bash
cd ~/Ginko-MD
rm -rf Sessions/Owner
npm start
```

### Error de permisos / módulos no encontrados
Vuelve a instalar las dependencias:
```bash
cd ~/Ginko-MD
rm -rf node_modules package-lock.json
npm install --no-audit --no-fund
```

---

## 📝 Comandos básicos
| Prefijo por defecto | Ejemplo |
|---|---|
| `.` (punto) | `.play canción`, `.menu`, `.sticker` |

Puedes cambiar el prefijo o configurar más opciones en `settings.js`.

---

## 📁 Estructura del proyecto
```
Ginko-MD/
├── cmds/               # Todos los comandos del bot (organizados por categorías)
│   ├── downloads/      # Comandos de descarga (ytmp3, tiktok, ig, etc.)
│   ├── group/          # Comandos de administración de grupos
│   ├── gacha/          # Sistema de gacha/waifus y economía
│   ├── main/           # Comandos de ayuda, menú, ping
│   ├── stickers/       # Creador de stickers
│   └── utils/          # Utilidades varias (IA, traductor, etc.)
├── core/               # Lógica principal (conexión a WA, base de datos, exif)
├── Sessions/           # Carpeta donde se guarda tu sesión de WhatsApp
├── tmp/                # Archivos temporales
├── index.js            # Punto de entrada del bot
├── main.js             # Manejador de comandos
├── settings.js         # Archivo de configuración principal
└── package.json        # Dependencias
```

---

## ⚠️ Aviso importante
Este proyecto es para fines educativos y de uso personal. El uso de bots de WhatsApp puede violar los Términos de Servicio de WhatsApp. Usa este bot bajo tu propia responsabilidad. No nos hacemos responsables por baneos o suspensiones de cuenta.

---

## 🙏 Créditos
- Construido sobre [WaSocket](https://github.com/this-xys/WaSocket) y Baileys
- Inspirado en bots estables del ecosistema MD
- Iconos/emojis: Twemoji

---

<p align="center">
  <sub>🍁 Hecho con cariño para la comunidad</sub>
</p>
