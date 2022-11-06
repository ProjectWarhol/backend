const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('NftContent', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contentPath: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
      },
      contentSize: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 10, // remove this later
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1, // remove this later (?)
      },
      flags: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      upvotes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      downvotes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      hasSold: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
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
      userId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'User',
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('NftContent');
  },
};
