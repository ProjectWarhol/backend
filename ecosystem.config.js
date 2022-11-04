module.exports = {
  apps: [
    {
      name: 'API',
      script: 'npm run dev',
      time: true,
      env: {
        PORT: process.env.PORT,
        DB_HOST: process.env.DB_HOST,
        DB_DATABASE: process.env.DB_DATABASE,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_PORT: process.env.DB_PORT,
      },
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: '46.101.106.146',
      // key: process.env.SSH_KEY_PATH,
      ref: 'origin/main',
      repo: 'https://github.com/ProjectWarhol/backend.git',
      path: '/var/www/production',
      'pre-deploy-local': '',
      'post-deploy': 'npm install',
      // 'pre-setup': '',
    },
  },
};
