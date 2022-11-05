const { updateEnvVariables } = require('../app/util/env.handler');
const { readFileToString } = require('../app/util/readFile');

const databaseEnvVariables = [
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
];
updateEnvVariables(databaseEnvVariables);

require('dotenv').config(); // this is important!

const commonConfig = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

const testConfig = () => {
  commonConfig.database = process.env.DB_TEST_DATABASE;
  commonConfig.username = process.env.DB_TEST_USERNAME;
  commonConfig.password = process.env.DB_TEST_PASSWORD;
  commonConfig.host = process.env.DB_HOST_TEST;
  commonConfig.port = process.env.DB_PORT_TEST;
  return commonConfig;
};

module.exports = {
  development: {
    ...commonConfig,
  },
  production: {
    ...commonConfig,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        ca: readFileToString('ca-certificate.crt'),
      },
    },
  },
  test: {
    ...testConfig(),
  },
};
