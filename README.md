<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=gradient&customColorList=12,23,25,30&text=🌿%20GINKO-MD%20🌿&fontSize=54&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Bot%20de%20WhatsApp%20Multi-Device%20·%20Ligero,%20rápido%20y%20fácil%20de%20usar&descSize=18&descAlignY=60" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=26&duration=2800&pause=600&color=4ADE80&center=true&vCenter=true&width=640&lines=🌿+Tu+bot+de+WhatsApp+con+estilo+🌿;⚡+Rápido+como+el+viento+⚡;🤖+IA+Gemini+integrada+🤖;🎵+Descargas%2C+TTS%2C+Stickers+y+más" alt="Typing SVG"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3200&pause=800&color=F472B6&center=true&vCenter=true&width=640&lines=📱+Funciona+en+Termux+(Android);🖥️+Compatible+con+VPS+y+panel;🍎+Detección+automática+de+iPhone" alt="Typing SVG"/>

<br/>

<img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Baileys-Multi%20Device-25D366?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Termux-Compatible-3DDC84?style=for-the-badge&logo=android&logoColor=white"/>
<img src="https://img.shields.io/badge/Idioma-Español-FF6B6B?style=for-the-badge"/>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

</div>

## 🌿 ¿Qué es Ginko-MD?

<p align="center">
  <img src="https://raw.githubusercontent.com/riokuroxi-svg/Ginko-MD/main/media/menu.jpg" alt="Menú de Ginko-MD (Bocchi)" width="620"/>
</p>

> 🌱 **Ginko-MD** es un bot de WhatsApp Multi-Device en español, pensado para correr **ligero** en Termux (Android) sin que te rompa la cabeza. Ideal para grupos, descargas, stickers, IA y entretenimiento.

- 🇲🇽 **Hecho por y para hispanohablantes**
- 📱 **Corre en tu celular** con Termux (no necesitas PC)
- 🧠 **IA Gemini** integrada de fábrica
- 🔊 **Notas de voz con voz femenina** (es-MX Dalia, Edge-TTS)
- 🖼️ **Menú con imagen** y botón nativo de canal de WhatsApp

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 📦 Instalación en Termux (Android)

> 📱 Copia y pega estos comandos **uno por uno** en Termux. No necesitas saber programar.

### 1️⃣ Actualizar paquetes
```bash
pkg update && pkg upgrade -y
```

### 2️⃣ Instalar herramientas necesarias
```bash
pkg install -y git nodejs python ffmpeg
```

### 3️⃣ Clonar el bot
```bash
git clone https://github.com/riokuroxi-svg/Ginko-MD
cd Ginko-MD
```

### 4️⃣ Instalar dependencias
```bash
npm install
```

### 5️⃣ (Opcional) Configurar tu key de Gemini para .ai
Crea un archivo `config.private.js` dentro de la carpeta `Ginko-MD` con este contenido (usa la key que te di en el bot):
```js
// config.private.js
export const geminiKey = "TU_KEY_DE_GEMINI_AQUI";
export default { geminiKey };
```

### 6️⃣ Iniciar el bot
```bash
npm start
```
Escanea el QR con **WhatsApp → Dispositivos vinculados → Vincular dispositivo**, ¡y listo! 🌿

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## ⚙️ Características

<div align="center">

| 🌿 Función | 💬 Descripción |
|:---|:---|
| 📥 **Descargas** | Música MP3 de YouTube, TikTok sin marca de agua, Deezer, Pinterest |
| 🔊 **TTS / Notas de voz** | `.tts <texto>` envía una nota de voz con voz femenina mexicana (Dalia) |
| 🧠 **IA (Gemini)** | `.ai` / `.gemini` con memoria de la conversación, soporta imágenes |
| 🖼️ **Stickers** | Crea stickers rápido desde imágenes/videos sin marca de agua |
| 📊 **Encuestas** | `.encuesta` con polls nativos de WhatsApp |
| 🎌 **Anime** | `.anime` para buscar info de animes (AniList) |
| 😄 **Diversión** | Chistes, datos, consejos, piropos, 8ball, ship, dado, moneda |
| 🔗 **Utilidades** | Códigos QR, acortar URLs, morse, recordatorios, .wastalk |
| 🔤 **Letras** | `.letra <canción>` busca letras de canciones |
| 💱 **Crypto** | `.btc` / `.crypto` para ver precios en tiempo real (CoinGecko) |
| 📝 **Código a imagen** | `.carbon` convierte código en imagen bonita |
| 🎵 **Deezer** | `.deezer` busca y descarga música en alta calidad |
| 👥 **Administración** | Kick, ban, promote, demote, antilink, bienvenidas automáticas |
| 🍎 **Compatible iPhone** | Detecta iPhones y evita mensajes que les causan problemas |
| 📣 **Canal oficial** | Botón nativo "Ver canal" en el menú principal |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🚀 Comandos rápidos

| Categoría | Ejemplos |
|:---|:---|
| 🤖 **IA** | `.ai <pregunta>`, `.ai reset` |
| 🔊 **Voz** | `.tts hola qué onda`, `.voz cómo estás` |
| 📥 **Descargas** | `.play <canción>`, `.tiktok <enlace>`, `.ytmp3 <enlace>` |
| 🎌 **Anime** | `.anime bocchi the rock` |
| 🔧 **Utilidades** | `.qrcode hola`, `.acortar <url>`, `.morse hola` |
| 📊 **Grupo** | `.encuesta opción1|opción2|opción3`, `.kick @usuario` |
| 😄 **Diversión** | `.chiste`, `.8ball sí o no`, `.ship @user1 @user2`, `.dado` |
| ℹ️ **Info** | `.menu`, `.help`, `.infobot`, `.letra <canción>` |
| 🔍 **GitHub** | `.gh riokuroxi-svg` |
| 💱 **Crypto** | `.btc`, `.crypto ethereum` |

> 💡 Usa **`.menu`** dentro de WhatsApp para ver la lista completa con todos los comandos y la imagen de Bocchi.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 💻 Instalación en VPS / Linux (PC o servidor)

Si prefieres correrlo en una PC o servidor Ubuntu/Debian:

```bash
apt update && apt upgrade -y
apt install -y git nodejs npm ffmpeg
git clone https://github.com/riokuroxi-svg/Ginko-MD
cd Ginko-MD
npm install
npm start
```

> ⚠️ **En Termux NO instales ffmpeg-static** (no funciona en Android). Usa el ffmpeg nativo (`pkg install ffmpeg`).

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🛠️ Comandos útiles en Termux

| Si pasa esto... | Haz esto |
|:---|:---|
| Se cierra el bot | `cd Ginko-MD && npm start` |
| Error al iniciar | `rm -rf sessions && npm start` (borra sesión, escanea QR de nuevo) |
| Error de dependencias | `rm -rf node_modules package-lock.json && npm install` |
| Quieres la última versión | `cd Ginko-MD && git pull` |
| Algo se rompe tras actualizar | `git reset --hard backup-antes-fusion-13ago` |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 📣 Canal oficial y redes

<p align="center">
  <a href="https://whatsapp.com/channel/0029VbDVFpSGJP89hfZUe522">
    <img src="https://img.shields.io/badge/📣%20Canal%20de%20WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
  </a>
  <a href="https://www.instagram.com/__ikg.05">
    <img src="https://img.shields.io/badge/📸%20Instagram%20del%20creador-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/>
  </a>
  <a href="https://github.com/riokuroxi-svg/Ginko-MD">
    <img src="https://img.shields.io/badge/🌿%20Repositorio%20principal-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
  <a href="https://github.com/riokuroxi-svg/Ginko-MD-Lab">
    <img src="https://img.shields.io/badge/🧪%20Ginko--MD--Lab%20(experimentos)-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## ⭐ Créditos

- 🌿 **Creador:** [riokuroxi-svg](https://github.com/riokuroxi-svg) 🇲🇽
- 🤖 **Librería:** [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) (WhatsApp Multi-Device)
- 🧠 **IA:** Google Gemini (Google AI Studio)
- 🔊 **TTS:** Microsoft Edge-TTS (voz es-MX-DaliaNeural)
- 🎨 **Inspiración visual del README:** [La Suki Bot](https://github.com/russellxz/LASUKIBOT)
- 💚 Gracias a la comunidad de bots de WhatsApp por las APIs y el apoyo

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=22&duration=3000&pause=800&color=4ADE80&center=true&vCenter=true&width=640&lines=🌿+GINKO-MD+🌿;Simple,+veloz+y+siempre+mejorando;¡Que+lo+disfrutes!+✨" alt="Typing SVG"/>

<br/>

<a href="https://github.com/riokuroxi-svg/Ginko-MD/stargazers">
  <img src="https://img.shields.io/github/stars/riokuroxi-svg/Ginko-MD?style=social"/>
</a>
<a href="https://github.com/riokuroxi-svg/Ginko-MD/forks">
  <img src="https://img.shields.io/github/forks/riokuroxi-svg/Ginko-MD?style=social"/>
</a>

<img src="https://capsule-render.vercel.app/api?type=waving&height=140&color=gradient&customColorList=12,23,25,30&section=footer" width="100%"/>

</div>
