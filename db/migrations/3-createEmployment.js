const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('Employment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
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
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      copmanyId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'Company',
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Employment');
  },
};
