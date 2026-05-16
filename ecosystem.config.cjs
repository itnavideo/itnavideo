module.exports = {
  apps: [
    {
      name: 'itnavideo-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'cluster',
      instances: process.env.WEB_CONCURRENCY || 'max',
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
    {
      name: 'itnavideo-render-worker',
      script: 'render-worker/server.mjs',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.RENDER_WORKER_PORT || process.env.PORT || 10000,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      max_memory_restart: process.env.RENDER_WORKER_MAX_MEMORY || '1024M',
      exp_backoff_restart_delay: 100,
      out_file: './logs/render-worker-out.log',
      error_file: './logs/render-worker-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
