const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('PictureComments', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      pictureId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'NftContent',
          },
          key: 'id',
        },
        allowNull: false,
      },
      commentId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'Comments',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PictureComments');
  },
};
