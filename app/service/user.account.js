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

exports.updateWallet = async (encryptedData, next, id) => {
  const updateData = await UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  }).catch((err) => {
    const error = new Error('Something went wrong while updating wallet');
    error.err = err;
    next(error);
  });

  return updateData;
};
