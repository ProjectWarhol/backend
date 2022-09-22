module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Employment', [
      {
        userId: userIds[0][0].id,
        employeeId: userIds[0][1].id,
      },
      {
        userId: userIds[0][0].id,
        employeeId: userIds[0][2].id,
      },
      {
        userId: userIds[0][0].id,
        employeeId: userIds[0][3].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Employment', null, {});
  },
};
