module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Promoting', [
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][1].id,
      },
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][2].id,
      },
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][3].id,
      },
      {
        userId: userIds[0][1].id,
        promotedId: userIds[0][0].id,
      },
      {
        userId: userIds[0][1].id,
        promotedId: userIds[0][3].id,
      },
      {
        userId: userIds[0][3].id,
        promotedId: userIds[0][2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Promoting', null, {});
  },
};
