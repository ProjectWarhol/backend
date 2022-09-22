const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
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
      resetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetTokenExp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      promoters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      employees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      promoting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isCompany: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      walletId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'UserAccount',
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.addConstraint('User', {
      fields: ['email'],
      type: 'unique',
    });
    await queryInterface.addConstraint('User', {
      fields: ['userName'],
      type: 'unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('User');
  },
};
