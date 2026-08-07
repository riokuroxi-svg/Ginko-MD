/*  [ Ginko - Clima ]
 *  Obtiene el clima de una ciudad con formato bonito.
 *  Uso: .clima <ciudad>
 */
export default {
  name: 'clima',
  tags: 'info',
  command: ['clima', 'tiempo'],
  description: 'Obtener el clima de una ciudad',
  example: 'clima Ciudad de México',
  limit: false,
  run: async (m, { sock, text }) => {
    try {
      if (!text) return m.reply('Por favor, escribe el nombre de la ciudad.');

      let wdata = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=es`
      );

      const d = wdata.data;
      const desc = d.weather[0].description;
      const temp = Math.round(d.main.temp);
      const feels = Math.round(d.main.feels_like);
      const min = Math.round(d.main.temp_min);
      const max = Math.round(d.main.temp_max);

      // Emoji según el clima
      let emoji = '🌤️'
      const id = d.weather[0].id
      if (id >= 200 && id < 300) emoji = '⛈️'
      else if (id >= 300 && id < 500) emoji = '🌧️'
      else if (id >= 500 && id < 600) emoji = '🌧️'
      else if (id >= 600 && id < 700) emoji = '❄️'
      else if (id >= 700 && id < 800) emoji = '🌫️'
      else if (id === 800) emoji = '☀️'
      else if (id > 800) emoji = '☁️'

      let textw = `${emoji} *Clima en ${d.name}, ${d.sys.country}*\n\n`
        + `*Condición:* ${desc}\n`
        + `*Temperatura:* ${temp}°C (min ${min}° / max ${max}°)\n`
        + `*Sensación térmica:* ${feels}°C\n`
        + `*Humedad:* ${d.main.humidity}%\n`
        + `*Viento:* ${d.wind.speed} m/s\n`
        + `*Nubes:* ${d.clouds.all}%\n\n`
        + global.set.footer;

      await sock.sendMessage(m.chat, { text: textw }, { quoted: m });
    } catch (error) {
      console.error('[Clima]', error.message);
      m.reply('❌ No encontré esa ciudad. Intenta con el nombre en español (ej: "Ciudad de México").');
    }
  }
}
