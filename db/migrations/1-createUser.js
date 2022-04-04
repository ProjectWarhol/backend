const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('User', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      resetToken: Sequelize.STRING,
      resetTokenExp: Sequelize.DATE,
      bio: Sequelize.STRING,
      promoters: Sequelize.INTEGER,
      promoting: Sequelize.INTEGER,
      verified: DataTypes.BOOLEAN,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('User');
  },
};
