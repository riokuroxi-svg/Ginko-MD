import axios from "axios";

export default {
    name: 'applemusic',
    tags: 'download',
    command: ['applemusic', 'apple'],
    description: 'Busca y descarga música de Apple Music',
    example: Func.example('%p', '%cmd', 'feel special twice'),
    limit: false,
    run: async(m, { sock, text }) => {
        if (!text) return m.reply('Por favor, proporciona el nombre de una canción o un enlace de Apple Music')
        
        try {
            m.reply(global.status.wait)
            
            // Si el texto no es una URL, buscar la canción
            if (!text.includes('music.apple.com')) {
                const searchResponse = await axios.get(`https://deliriussapi-oficial.vercel.app/search/applemusic?text=${encodeURIComponent(text)}`);
                
                if (!searchResponse.data.length) {
                    return m.reply('No se encontraron resultados para tu búsqueda.');
                }

                // Tomar el primer resultado
                const firstResult = searchResponse.data[0];
                
                // Mostrar resultados de búsqueda
                const searchCaption = `*🎵 Resultado encontrado:*\n\n` +
                                    `*• Título:* ${firstResult.title}\n` +
                                    `*• Artista:* ${firstResult.artists}\n` +
                                    `*• Tipo:* ${firstResult.type}\n\n` +
                                    `_Descargando música, espere..._`;
                await sock.sendFThumb(m.chat, global.set.wm, searchCaption, firstResult.image, null, m);
                
                text = firstResult.url;
            }
            
            const response = await axios.get(`https://deliriussapi-oficial.vercel.app/download/applemusicdl?url=${encodeURIComponent(text)}`);
            const { data } = response.data;

            const downloadCaption = `*A P P L E - M U S I C*\n\n` +
                                  `*• Título:* ${data.name}\n` +
                                  `*• Artista:* ${data.artists}\n` +
                                  `*• Duración:* ${data.duration}\n` +
                                  `*• Tipo:* ${data.type}\n\n` +
                                  `_Descargado por Ginko AI_`;
            
            await sock.sendFThumb(m.chat, global.set.wm, downloadCaption, data.image, null, m);
            await sock.sendMessage(
                m.chat,
                {
                    document: { url: data.download },
                    fileName: `${data.name}.mp3`,
                    mimetype: "audio/mpeg"
                },
                { quoted: m }
            );

        } catch (error) {
            console.error(error);
            m.reply('Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo.')
        }
    }
}