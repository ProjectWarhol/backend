const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('UserAccount', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      publicKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      mnemonicHash: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      ciphertext: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      iv: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      cipher: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      kdf: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      mac: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      dklen: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      n: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      r: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      p: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserAccount');
  },
};
