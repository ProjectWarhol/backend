module.exports = {
  deploy: {
    production: {
      user: 'root',
      host: '46.101.106.146',
      ssh_options: 'StrictHostKeyChecking=no',
      key: '~/.ssh/deploy.key',
      // key: process.env.SSH_KEY_PATH_TEST,
      ref: 'origin/main',
      repo: 'https://github.com/ProjectWarhol/backend.git',
      path: '/var/www/production',
      env: {
        IP_ADDRESS: process.env.IP_ADDRESS,
        NODE_ENV: process.env.NODE_ENV,
        FOO_COOKIE_SECRET: process.env.FOO_COOKIE_SECRET,
        SEQUELIZE_LOGGING: process.env.SEQUELIZE_LOGGING,
        DB_URL: process.env.DB_URL,
      },
      'post-deploy':
        'npm install && pm2 start npm -- run prod && pm2 startOrRestart ecosystem.config.js --env production && pm2 save',
    },
  },
};
