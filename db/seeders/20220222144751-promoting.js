const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Promoting', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][0].id,
        promoterId: userIds[0][1].id,
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][0].id,
        promoterId: userIds[0][2].id,
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][0].id,
        promoterId: userIds[0][3].id,
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][1].id,
        promoterId: userIds[0][0].id,
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][1].id,
        promoterId: userIds[0][3].id,
        createdAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        userId: userIds[0][3].id,
        promoterId: userIds[0][2].id,
        createdAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Promoting', null, {});
  },
};
