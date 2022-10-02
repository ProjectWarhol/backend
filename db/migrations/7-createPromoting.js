const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('Promoting', {
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
      promotedId: {
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
    });
    await queryInterface.addConstraint('Promoting', {
      fields: ['promotedId'],
      type: 'check',
      where: {
        promotedId: {
          [Sequelize.Op.ne]: { [Sequelize.Op.col]: 'Promoting.userId' },
        },
      },
    });
    await queryInterface.addConstraint('Promoting', {
      fields: ['userId', 'promotedId'],
      type: 'unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Promoting');
  },
};
