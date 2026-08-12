# 🍁 Ginko-MD — Bot WhatsApp Multi-Device

Bot de WhatsApp estable, multifuncional, basado en Baileys (Multi-Device).

---

## 📝 Descripción

Ginko-MD es un bot de WhatsApp con muchísimas funciones: descargas de música/videos, stickers, juegos/gacha, economía, IA, gestión de grupos, anti-link, bienvenidas, y mucho más. Funciona en Termux/Android, VPS Linux, y cualquier servidor que soporte Node.js.

---

## ✅ Características
- Descargas de YouTube (audio/video), TikTok, Instagram, Facebook, Twitter/X
- Creador de stickers (con texto incluido)
- Comandos de gacha y economía
- Gestión completa de grupos (kick, add, promote, demote, anti-link, bienvenidas)
- Comandos de IA/chat y traductor
- Respuestas automáticas y menciones
- Auto-reconexión si se cae la conexión
- Código de vinculación de 8 dígitos (pairing code), no necesita QR

---

## 🚀 Instalación

### 📱 Termux (Android)
Ejecuta estos comandos UNO POR UNO en Termux:

1. Dar permiso de almacenamiento (solo la primera vez):
```bash
termux-setup-storage
```

2. Instalar dependencias del sistema:
```bash
apt update && apt upgrade -y && pkg install -y git nodejs ffmpeg imagemagick
```

3. Clonar el repositorio:
```bash
git clone <TU_URL_DE_GITHUB_AQUI> Ginko-MD
```

4. Entrar a la carpeta:
```bash
cd Ginko-MD
```

5. Instalar dependencias de Node:
```bash
npm install --no-audit --no-fund
```

6. Configurar tu número de owner:
Abre el archivo `settings.js` y cambia el número en la línea `global.owner` por tu número (solo dígitos, sin + ni espacios, ejemplo México: `525574370309`).

7. Arrancar el bot:
```bash
npm start
```

> *Si aparece el mensaje **(Y/I/N/O/D/Z) [default=N] ?** durante la instalación, escribe la letra **"y"** y presiona ENTER para continuar.*

---

### ☁️ VPS Linux (Ubuntu/Debian)
```bash
apt update && apt upgrade -y
apt install -y git nodejs npm ffmpeg imagemagick
git clone <TU_URL_DE_GITHUB_AQUI> Ginko-MD
cd Ginko-MD
npm install
# Edita settings.js con tu número
npm start
```

---

## ⚡ Para dejarlo corriendo en segundo plano (Termux/VPS)
Para que no se apague cuando cierres Termux, usa PM2:
```bash
npm i -g pm2
termux-wake-lock
pm2 start index.js --name ginko
pm2 save
```

Comandos útiles de PM2:
- Ver los logs en tiempo real: `pm2 logs ginko`
- Parar el bot: `pm2 stop ginko`
- Reiniciar: `pm2 restart ginko`
- Borrar el proceso: `pm2 delete ginko`

---

## 📌 Si se apaga o se corta el internet
Solo vuelve a entrar a la carpeta y arranca de nuevo:
```bash
cd ~/Ginko-MD && npm start
```

## 🔄 Volver a vincular de cero
Si quieres cambiar el número o se corrompe la sesión:
```bash
cd ~/Ginko-MD
rm -rf Sessions/Owner
npm start
```
