const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('Promoting', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userId: DataTypes.UUID,
      promoterId: DataTypes.UUID,
      createdAt: Sequelize.DATE,
    });
    await queryInterface.addConstraint('Promoting', {
      fields: ['promoterId'],
      type: 'check',
      where: {
        promoterId: {
          [Sequelize.Op.ne]: { [Sequelize.Op.col]: 'Promoting.userId' },
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Promoting');
  },
};
