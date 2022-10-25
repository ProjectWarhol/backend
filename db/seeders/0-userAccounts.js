const {
  createCustodialWallet,
} = require('../../app/controllers/custodial_wallet');

module.exports = {
  up: async (queryInterface) => {
    const publicKeys = [
      await createCustodialWallet(),
      await createCustodialWallet(),
      await createCustodialWallet(),
    ];

    await queryInterface.bulkInsert('UserAccount', [
      {
        publicKey: publicKeys[0][0].address,
      },
      {
        publicKey: publicKeys[1][0].address,
      },
      {
        publicKey: publicKeys[2][0].address,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserAccount', null, {});
  },
};
