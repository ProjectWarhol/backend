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
      ref: 'origin/feature/pm2/ci',
      repo: 'https://github.com/ProjectWarhol/backend.git',
      path: '/var/www/production',
      env: {
        NODE_ENV: 'production',
        FOO_COOKIE_SECRET: process.env.FOO_COOKIE_SECRET,
        SEQUELIZE_LOGGING: process.env.SEQUELIZE_LOGGING,
        DB_URL: process.env.DB_URL,
      },
      script: 'npm run prod',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
