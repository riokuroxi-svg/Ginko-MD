/*  [ Ginko - Banco ]
 *  Deposita y retira dinero del banco.
 *  Adaptado del sistema de banco de GataBot (Gata Dios).
 *  Uso: .dep <cantidad>  |  .retirar <cantidad>  |  .banco
 */
export default {
  name: 'banco',
  tags: 'rpg',
  command: ['banco', 'dep', 'depositar', 'retirar', 'withdraw'],
  description: 'Deposita o retira dinero del banco',
  example: 'dep 5000  |  retirar 5000  |  banco',
  rpg: true,
  run: async (m, { sock, command, text }) => {
    const user = global.db.users[m.sender]
    if (typeof user.bank !== 'number') user.bank = 0

    // Ver balance del banco
    if (command === 'banco') {
      return m.reply(`🏦 *TU BANCO*\n\n> 💰 En banco: ${user.bank.toLocaleString()}\n> 💰 En mano: ${(user.money || 0).toLocaleString()}\n\nUso: .dep <cantidad>  |  .retirar <cantidad>`)
    }

    const cantidad = parseInt(text)
    if (!cantidad || cantidad < 1) return m.reply('❌ Escribe una cantidad válida.')

    if (command === 'dep' || command === 'depositar') {
      if ((user.money || 0) < cantidad) return m.reply('❌ No tienes ese dinero en mano.')
      user.money -= cantidad
      user.bank += cantidad
      return m.reply(`🏦 *Depositado:* +${cantidad.toLocaleString()} al banco.\n\n> Banco: ${user.bank.toLocaleString()}`)
    }

    if (command === 'retirar' || command === 'withdraw') {
      if (user.bank < cantidad) return m.reply('❌ No tienes ese dinero en el banco.')
      user.bank -= cantidad
      user.money += cantidad
      return m.reply(`🏧 *Retirado:* +${cantidad.toLocaleString()} del banco.\n\n> Banco: ${user.bank.toLocaleString()}`)
    }
  }
}
