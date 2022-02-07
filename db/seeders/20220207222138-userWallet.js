module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('UserWallet', [
      {
        passwordHash: 'OmarBadawy',
      },
      {
        passwordHash: 'JulianRomer',
      },
      {
        passwordHash: 'TakahiroMitsui',
      },
      {
        passwordHash: 'MassiRicci',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserWallet', null, {});
  },
};
