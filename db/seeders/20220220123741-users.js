const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const accountIds = await queryInterface.sequelize.query(
      `SELECT id from "UserAccount";`
    );

    await queryInterface.bulkInsert('User', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        email: 'omar.badawy@warhol.com',
        passwordHash: await bcrypt.hash('OmarBadawy', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 1000,
        promoting: 1001,
        verified: true,
        userName: 'Omar_Badawy',
        walletId: accountIds[0][0].id,
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        email: 'takahiro.Mitsui@warhol.com',
        passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 9876,
        promoting: 7654,
        verified: false,
        userName: 'Takahiro_Mitsui',
        walletId: accountIds[0][1].id,
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        email: 'massi.ricci@warhol.com',
        passwordHash: await bcrypt.hash('MassiRicci', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 250,
        promoting: 900,
        verified: false,
        userName: 'Massi_Ricci',
        walletId: accountIds[0][2].id,
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        email: 'julian.romer@warhol.com',
        passwordHash: await bcrypt.hash('JulianRomer', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 2000,
        promoting: 1234,
        verified: true,
        userName: 'Julian_Romer',
        walletId: null,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
