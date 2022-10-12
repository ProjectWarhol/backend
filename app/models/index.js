const fs = require('fs');

const path = require('path');
require('dotenv').config();

const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: Number(config.port),
    dialect: config.dialect,
    logging: config.logging,
    ssl: config.ssl,
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
