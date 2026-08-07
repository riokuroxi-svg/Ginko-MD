/*  [ Ginko - Configuración PM2 para producción ]
 *  PM2 mantiene el bot corriendo siempre (auto-reinicia si se cae).
 *
 *  USO:
 *    pm2 start ecosystem.config.js     # iniciar
 *    pm2 save                          # guardar para que sobreviva reinicios del servidor
 *    pm2 startup                       # configurar para arranque automático del sistema
 *    pm2 logs Ginko                    # ver logs
 *    pm2 status                        # estado
 *
 *  NOTA IMPORTANTE para Baileys: NO usar cluster mode (instances > 1)
 *  porque rompe la sesión de WhatsApp. Usar fork mode (1 instancia).
 */
module.exports = {
  apps: [
    {
      name: 'Ginko',
      script: 'system/index.js',        // punto de entrada
      instances: 1,                     // 1 sola instancia (NO usar max para Baileys)
      exec_mode: 'fork',                // fork mode (no cluster)
      autorestart: true,                // reiniciar automáticamente si se cae
      watch: false,                     // NO watch en producción
      max_memory_restart: '500M',       // reiniciar si pasa 500MB de RAM
      restart_delay: 5000,              // esperar 5s antes de reiniciar tras un crash
      max_restarts: 10,                 // máximo reinicios seguidos
      min_uptime: '10s',                // tiempo mínimo que debe estar arriba
      kill_timeout: 5000,               // tiempo de cierre

      // Variables de entorno
      env: {
        NODE_ENV: 'production',
        // GEMINI_API_KEY: 'tu_key_aqui',  // opcional: key de Gemini por env
      },

      // Logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
