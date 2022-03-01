const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const walletIds = await queryInterface.sequelize.query(
      `SELECT id from "UserAccount";`
    );

    await queryInterface.bulkInsert('User', [
      {
        email: 'omar.badawy@warhol.com',
        passwordHash: await bcrypt.hash('OmarBadawy', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 1000,
        promoting: 1001,
        verified: true,
        userName: 'Omar_Badawy',
        avatar: 'https://toppng.com/uploads/preview/stock-person-png-stock-photo-man-11563049686zqeb9zmqjd.png',
        walletId: walletIds[0][0].id,
      },
      {
        email: 'takahiro.Mitsui@warhol.com',
        passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 9876,
        promoting: 7654,
        verified: false,
        userName: 'Takahiro_Mitsui',
        avatar: 'https://www.vhv.rs/dpng/d/443-4434567_free-png-download-happy-person-png-images-background.png',
        walletId: walletIds[0][1].id,
      },
      {
        email: 'massi.ricci@warhol.com',
        passwordHash: await bcrypt.hash('MassiRicci', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 250,
        promoting: 900,
        verified: false,
        userName: 'Massi_Ricci',
        avatar: 'https://www.pngitem.com/pimgs/m/128-1282867_businessperson-african-american-black-stock-photography-african-business.png',
        walletId: walletIds[0][2].id,
      },
      {
        email: 'julian.romer@warhol.com',
        passwordHash: await bcrypt.hash('JulianRomer', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 2000,
        promoting: 1234,
        verified: true,
        avatar: 'https://www.pngitem.com/pimgs/m/227-2271479_grandma-png-picture-old-woman-thumbs-up-transparent.png',
        userName: 'Julian_Romer',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
