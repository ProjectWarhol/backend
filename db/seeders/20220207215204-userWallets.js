const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('UserWallet', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        publicKey: await bcrypt.hash('OmarBadawy', 12),
        passwordHash: await bcrypt.hash('OmarBadawy', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        publicKey: await bcrypt.hash('TakahiroMitsui', 12),
        passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        publicKey: await bcrypt.hash('MassiRicci', 12),
        passwordHash: await bcrypt.hash('MassiRicci', 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserWallet', null, {});
  },
};
