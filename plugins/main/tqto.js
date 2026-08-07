export default {
  name: 'Creditos',
  tags: 'main',
  command: ['tqto', 'creditos', 'Agradecimientos'],
  description: 'Créditos de desarrollador',
  example: '',
  run: async(m, { sock, text, command }) => {
    let teks = `*[ Gracias a ]*\n\n`
    
    
    teks += `*-* Desarrollado por *@__ikg.05*\n`
    teks += global.set.footer
    m.reply(teks)
  }
}