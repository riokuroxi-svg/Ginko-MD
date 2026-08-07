<div align="center">

# 🌿 Ginko — WhatsApp Bot Multi-Device

![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen?style=flat-square&logo=node.js)
![Platform](https://img.shields.io/badge/Platform-WhatsApp-25D366?style=flat-square&logo=whatsapp&logoColor=white)
![Multi-Device](https://img.shields.io/badge/Multi--Device-Supported-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

**Un bot de WhatsApp Multi-Device potente y rápido** construido con **Baileys** — economía, juegos, descargas, IA, mangas en PDF y mucho más.

<img src="media/banner.jpg" width="100%" alt="Ginko - Banner" />

> ### 👑 Creado por [riokuroxi-svg](https://github.com/riokuroxi-svg)
> 🌱 **Ginko** es un proyecto original y activo. Si te gusta, sígueme y comparte 🙌

</div>

---

## ✨ Características destacadas

| | |
|---|---|
| 🤖 | **Chat IA** (Gemini) con memoria de conversación |
| 📚 | **Descarga de mangas** en PDF (MangaDex + fuentes, comprimido, rangos de 10 capítulos) |
| 💰 | **Economía completa** (balance, banco, duelo, casino, trabajar, minar) |
| 🎵 | **Música** de YouTube con botones Audio/Video |
| 🎬 | **Anime** y **Tráilers** de películas |
| 📥 | **Descargas** con fallback múltiple (TikTok, Instagram, Spotify, Mega...) |
| 🛡️ | **Seguridad anti-ban** + anti-flood + captcha |
| 🎮 | **Juegos** y diversión |

---

## 🚀 Instalación

**Requisitos:** Node.js 18+, npm, FFmpeg, git

```bash
npm install --legacy-peer-deps
npm start
```

> Usa `--legacy-peer-deps` porque la base depende de `jimp@0.16` y Baileys espera jimp@1.x.

Al arrancar por primera vez te generará un **código de emparejamiento** (pairing code).
Ábrelo en WhatsApp → *Dispositivos vinculados → Vincular con número de teléfono*.

---

## ⚙️ Configuración (storage/config.js)

```js
global.owner = ["5215574370309"];      // ⚠️ TU NÚMERO (código país + número, sin +)
global.pairingNumber = "Your_Number";  // ⚠️ EL NÚMERO que usará el bot
// Redes sociales (media.*) → pon las tuyas
// set.wm / set.author / set.footer → branding de Ginko
```

> ⚠️ **Recomendación anti-ban:** usa un **número dedicado** para el bot (no tu número personal) y aclimátalo unos días antes de activarlo a tope.

---

## 🛡️ Seguridad

Actívalas con `.on <flag>` o `.captcha on`:

- `.captcha on` — Verificación anti-bot al entrar al grupo
- `.on antiprivado` — Ignora mensajes privados de no-owner
- `.on antiinternacional` — Bloquea números de otros países
- `.on <flag>` / `.off <flag>` — Activa/desactiva funciones
- *Automático* — **Anti-Flood** y **anti-ban** (reconexión con back-off)

---

## 🎮 Juegos y economía

### 💰 Economía
| Comando | Descripción |
|---|---|
| `.balance` / `.money` | Ver tu dinero, exp, nivel |
| `.claim` / `.daily` | Recompensa diaria |
| `.trabajar` / `.minar` / `.crimen` | Gana dinero |
| `.dep` / `.retirar` / `.banco` | Banco |
| `.transfer` / `.darcoins` | Transfiere dinero |
| `.top` | Ranking |

### ⚔️ Juegos de apuesta
| Comando | Descripción |
|---|---|
| `.duelo @usuario <cant>` | Duelo apostando |
| `.casino <cant>` | Casino |
| `.coinflip <cara\|cruz> <cant>` | Cara o cruz |
| `.ppt <piedra\|papel\|tijera> <cant>` | Piedra, papel o tijera |
| `.math` | Juego de matemáticas |
| `.stop` / `.adedonha` | Adedonha/Stop |

---

## 📥 Descargas

`apk, applemusic, deezer, facebook, gitclone, instagram, letra, mediafire, mega, pinterest, play, rule34, shazam, soundcloud, spotify, tiktok, twitter, ytmp4, ytv, manga`

> Las descargas usan **fallback múltiple**: si una API falla, se prueba otra automáticamente.

---

## 🛠️ Utilidades

- `.anime` — Info de anime con portada
- `.trailer` — Tráiler de películas/series
- `.qrcode` / `.tts` / `.morse` / `.vcard` — Herramientas
- `.wiki` / `.translate` / `.clima` — Información
- `.remini` / `.removebg` / `.toanime` — Imágenes
- `.chiste` / `.dato` / `.consejo` — Entretenimiento
- `.piropo` / `.love` / `.iqtest` / `.zodiac` — Diversión

---

## 🔍 Funciones premium

| Comando | Descripción |
|---|---|
| `.nsfw` / `.nsfwscan` | NSFW Scanner con veredicto |
| `.jadibot` | Sub-bot con código de emparejamiento |
| `.ping` / `.panel` | Diagnóstico de sistema |
| `.terminos` / `.tyc` | Términos y condiciones con botones |
| `.mquoted` | Depuración del mensaje citado |

---

## 🧩 Estructura

```
plugins/
  _antifunction/   # anti-flood, antilink, antiprivado...
  convert/         # sticker, toanime, logo, fx...
  download/        # tiktok, youtube, manga, mega...
  group/           # add, kick, welcome, captcha...
  info/            # ping, runtime, creator...
  main/            # menu, menugrupo, terminos...
  owner/           # jadibot, setmenu, eval...
  rpg/             # economía, juegos, duelo...
  tools/           # anime, trailer, nsfw, utilidades...
storage/
  config.js        # configuración central
system/
  main.js          # conexión Baileys
```

---

## 🏭 Producción (PM2)

```bash
npm install -g pm2
npm run prod          # pm2 start ecosystem.config.js
pm2 save && pm2 startup
pm2 logs Ginko
```

> `ecosystem.config.js` ya está configurado: auto-reinicio, reinicio por memoria (500MB), fork mode.

### Variables de entorno (.env)
Copia `.env.example` a `.env` y pon tus valores (`GEMINI_API_KEY`).
> ⚠️ **NUNCA subas tu `.env` ni tu `config.js` con key real a GitHub.**

---

## 📄 Licencia

MIT

---

## 💜 Créditos

**Ginko** fue creado y es mantenido por **[riokuroxi-svg](https://github.com/riokuroxi-svg)**.

- 🐦 **GitHub:** [riokuroxi-svg](https://github.com/riokuroxi-svg)
- 📸 **Instagram:** [@__ikg.05](https://www.instagram.com/__ikg.05)

Si te gusta el bot, **sígueme** y comparte el proyecto. 🙏

> ⚠️ Si haces un fork o lo usas, **mantén los créditos visibles**.
