/*  [ Ginko - Confirmar Transferencia ]
 *  Confirma una transferencia pendiente (se inicia con .transfer).
 */
export default {
  name: 'confirmar',
  tags: 'rpg',
  command: ['confirmar', 'confirm'],
  description: 'Confirma una transferencia pendiente',
  example: 'confirmar',
  rpg: true,
  run: async (m, { sock, command, text }) => {
    // La confirmación la maneja el plugin de transferencia mediante variable global
    // Simplificación: el plugin transfer ejecuta directamente si ya hay confirmación.
    m.reply('ℹ️ La confirmación se maneja directamente en .transfer. Usa: .transfer money <cantidad> @usuario')
  }
}
