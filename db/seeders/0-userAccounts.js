const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('UserAccount', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
      
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserAccount', null, {});
  },
};
