const {
  createCustodialWallet,
} = require('../../app/controllers/custodial_wallet');

module.exports = {
  up: async (queryInterface) => {
    const publicKeys = [
      await createCustodialWallet().wallet.address,
      await createCustodialWallet().wallet.address,
      await createCustodialWallet().wallet.address,
    ];
    await queryInterface.bulkInsert('UserAccount', [
      {
        publicKey: publicKeys[0],
      },
      {
        publicKey: publicKeys[1],
      },
      {
        publicKey: publicKeys[2],
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserAccount', null, {});
  },
};
