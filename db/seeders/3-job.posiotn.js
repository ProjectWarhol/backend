module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );
    const companyIds = await queryInterface.sequelize.query(
      `SELECT id from "Company";`
    );

    await queryInterface.bulkInsert('JobPosition', [
      {
        userId: userIds[0][0].id,
        companyId: companyIds[0][1].id,
      },
      {
        userId: userIds[0][0].id,
        companyId: companyIds[0][2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('JobPosition', null, {});
  },
};
