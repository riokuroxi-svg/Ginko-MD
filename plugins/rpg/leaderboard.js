/*  [ Ginko - Leaderboard / Top ]
 *  Muestra el top de usuarios por dinero, nivel o exp.
 *  Uso: .top  |  .top money  |  .top nivel  |  .top exp
 */
export default {
  name: 'leaderboard',
  tags: 'rpg',
  command: ['top', 'leaderboard', 'ranking'],
  description: 'Top de usuarios por dinero/nivel/exp',
  example: 'top  o  top money',
  rpg: true,
  run: async (m, { sock, text }) => {
    const criterio = (text || 'money').toLowerCase()
    const campos = { money: '💰 Dinero', exp: '⚡ EXP', nivel: '🏆 Nivel', level: '🏆 Nivel' }
    const campo = campos[criterio] ? (criterio === 'nivel' ? 'level' : criterio) : 'money'
    const etiqueta = campos[criterio] || '💰 Dinero'

    const users = Object.entries(global.db.users || {})
      .map(([jid, u]) => ({ jid, valor: u[campo] || 0 }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10)

    let teks = `🏆 *TOP 10 - ${etiqueta}*\n\n`
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
    users.forEach((u, i) => {
      const name = u.jid.split('@')[0]
      teks += `${medals[i] || '•'} *${i + 1}.* ${name} — ${u.valor.toLocaleString()}\n`
    })
    teks += `\n${global.set.footer}`
    m.reply(teks)
  }
}
