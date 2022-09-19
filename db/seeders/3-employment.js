module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Employment', [
      {
        userId: userIds[0][0].id,
        employeedId: userIds[0][1].id,
      },
      {
        userId: userIds[0][0].id,
        employeedId: userIds[0][2].id,
      },
      {
        userId: userIds[0][0].id,
        employeedId: userIds[0][3].id,
      },
      {
        userId: userIds[0][1].id,
        employeedId: userIds[0][0].id,
      },
      {
        userId: userIds[0][1].id,
        employeedId: userIds[0][3].id,
      },
      {
        userId: userIds[0][3].id,
        employeedId: userIds[0][2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Employment', null, {});
  },
};
