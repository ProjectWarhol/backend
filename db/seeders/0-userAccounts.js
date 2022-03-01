module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('UserAccount', [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserAccount', null, {});
  },
};
