const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('NftContent', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contentPath: {
        type: Sequelize.STRING,
        allowNull: true, // change to false later
      },
      contentSize: {
        type: Sequelize.INTEGER,
        allowNull: true, // change to false later
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true, // change to false later (?)
      },
      flags: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      downvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      hasSold: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      userId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'User',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('NftContent');
  },
};
