require('dotenv').config(); // this is important!

const sequelizeLogging = process.env.SEQUELIZE_LOGGING || 'true';
const logging = sequelizeLogging === 'true' ? console.log : false; // eslint-disable-line no-console

module.exports = {
  development: {
    username: process.env.DB_DEVELOPMENT_USERNAME,
    password: process.env.DB_DEVELOPMENT_PASSWORD,
    database: process.env.DB_DEVELOPMENT_DATABASE,
    host: process.env.DB_DEVELOPMENT_HOST,
    port: process.env.DB_DEVELOPMENT_PORT,
    logging,
    dialect: 'postgres',
    ssl: false,
  },
  staging: {
    username: process.env.DB_STAGING_USERNAME,
    password: process.env.DB_STAGING_PASSWORD,
    database: process.env.DB_STAGING_DATABASE,
    host: process.env.DB_STAGING_HOST,
    port: process.env.DB_STAGING_PORT,
    logging,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    ssl: true,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    ssl: false,
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT,
    logging,
    dialect: 'postgres',
    ssl: false,
  },
};
