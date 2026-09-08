module.exports = {
  apps: [
    {
      name: 'itnavideo-web',
      script: '.next/standalone/server.js',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      max_memory_restart: process.env.WEB_MAX_MEMORY || '768M',
      exp_backoff_restart_delay: 100,
      out_file: './logs/web-out.log',
      error_file: './logs/web-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
