// This Fk is at the end of migration in order to avoid Circularity error between USER and COMPANY table.

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fk" FOREIGN KEY ("companyId") REFERENCES "Company" (id);'
    );
  },

  down: async (_queryInterface) => {},
};
