module.exports = {
  apps: [
    {
      name: 'gialai-travel',
      script: './be/src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SERVE_STATIC: 'true',
      },
    },
  ],
};
