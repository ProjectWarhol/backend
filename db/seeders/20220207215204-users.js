module.exports = {
  up: async (queryInterface) => {
    const walletQuery = await queryInterface.sequelize.query(
      `SELECT id from "UserWallet";`
    );

    const walletOneId = walletQuery[0];
    const walletTwoId = walletQuery[1];
    const walletThreeId = walletQuery[2];
    const walletFourId = walletQuery[3];

    await queryInterface.bulkInsert('User', [
      {
        userName: 'Omar_Badawy',
        email: 'omar.badawy@warhol.com',
        passwordHash: 'OmarBadawy',
        verified: true,
        walletId: walletOneId,
      },
      {
        userName: 'Julian_Romer',
        email: 'julian.romer@warhol.com',
        passwordHash: 'JulianRomer',
        verified: true,
        walletId: walletTwoId,
      },
      {
        userName: 'Takahiro_Mitsui',
        email: 'takahiro.Mitsui@warhol.com',
        passwordHash: 'TakahiroMitsui',
        verified: false,
        walletId: walletThreeId,
      },
      {
        userName: 'Massi_Ricci',
        email: 'massi.ricci@warhol.com',
        passwordHash: 'MassiRicci',
        verified: false,
        walletId: walletFourId,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
