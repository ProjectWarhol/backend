const db = require('../models');

const { UserAccount } = db;

exports.createWallet = async (walletPublicKey, next) => {
  const account = await UserAccount.create(walletPublicKey).catch((err) => {
    const error = new Error('Something went wrong while creating wallet');
    error.err = err;
    next(error);
  });
  return account;
};
