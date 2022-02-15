const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('User', [
      {
        id: 'qwertyui-asdf-asdf-asdf-zxcvbnmnbvcx',
        email: 'omar.badawy@warhol.com',
        passwordHash: await bcrypt.hash('OmarBadawy', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 1000,
        promoting: 1001,
        verified: true,
        userName: 'Omar_Badawy',
      },
      {
        id: 'abcdabcd-wdfg-3f4f-fsef-ahsiru75839e',
        email: 'takahiro.Mitsui@warhol.com',
        passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 9876,
        promoting: 7654,
        verified: false,
        userName: 'Takahiro_Mitsui',
      },
      {
        id: 'hgytjudk-74hf-98uh-jhdi-sysuh87u6vc2',
        email: 'massi.ricci@warhol.com',
        passwordHash: await bcrypt.hash('MassiRicci', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 250,
        promoting: 900,
        verified: false,
        userName: 'Massi_Ricci',
      },
      {
        id: '1q2w3e4r-aisu-woei-poiu-yhnbgtrfuytr',
        email: 'julian.romer@warhol.com',
        passwordHash: await bcrypt.hash('JulianRomer', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
        promoters: 2000,
        promoting: 1234,
        verified: true,
        userName: 'Julian_Romer',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
