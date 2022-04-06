const {
  createCustodialWallet,
} = require('../../app/blockchain/wallet/custodial_wallet');

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        publicKey: publicKeys[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        publicKey: publicKeys[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserAccount', null, {});
  },
};
