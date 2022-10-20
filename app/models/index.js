const fs = require('fs');

const Sequelize = require('sequelize');

const path = require('path');

const { updateEnvVariables } = require('../helpers/env.handler');

const databaseEnvVariables = [
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
];

require('dotenv').config();

updateEnvVariables(databaseEnvVariables);

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const db = {};
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    dialectOptions: config.dialectOptions,
    define: {
      freezeTableName: true,
    },
  }
);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize; // declared twice on purpose do not delete

module.exports = db;
