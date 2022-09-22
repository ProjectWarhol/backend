const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const walletIds = await queryInterface.sequelize.query(
      `SELECT id from "UserAccount";`
    );

    await queryInterface.bulkInsert('User', [
      {
        userName: 'Omar_Badawy',
        email: 'omar.badawy@warhol.com',
        passwordHash: await bcrypt.hash('OmarBadawy', 12),
        promoters: 1000,
        promoting: 1001,
        employees: 0,
        verified: true,
        isCompany: false,
        walletId: walletIds[0][0].id,
      },
      {
        userName: 'Takahiro_Mitsui',
        email: 'takahiro.Mitsui@warhol.com',
        passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
        promoters: 9876,
        promoting: 7654,
        employees: 50,
        verified: false,
        isCompany: false,
        walletId: walletIds[0][1].id,
      },
      {
        userName: 'Massi_Ricci',
        email: 'massi.ricci@warhol.com',
        passwordHash: await bcrypt.hash('MassiRicci', 12),
        promoters: 250,
        promoting: 900,
        employees: 0,
        verified: false,
        isCompany: false,
        walletId: walletIds[0][2].id,
      },
      {
        userName: 'Julian_Romer',
        email: 'julian.romer@warhol.com',
        passwordHash: await bcrypt.hash('JulianRomer', 12),
        promoters: 2000,
        promoting: 1234,
        employees: 0,
        verified: true,
        isCompany: false,
      },
      {
        userName: 'Julius_Klingelhoeller',
        email: 'julian.klingelhoeller@warhol.com',
        passwordHash: await bcrypt.hash('JuliusKlingelhoeller', 12),
        promoters: 12,
        promoting: 13,
        employees: 0,
        verified: true,
        isCompany: false,
      },
      {
        userName: 'Crack',
        email: 'Crac@warhol.unos',
        passwordHash: await bcrypt.hash('whoarewe', 12),
        promoters: 12,
        promoting: 13,
        employees: 0,
        verified: true,
        isCompany: true,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
