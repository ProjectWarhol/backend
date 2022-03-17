/* eslint-disable consistent-return */
const db = require('../models');
const {
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { UserAccount } = db;

exports.addWalletToDatabase = async (walletPublicKey, next) => {
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

exports.deleteWallet = async (id, res, next) => {
  const deletedData = await UserAccount.destroy({
    where: { id },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 1) {
        return rowsDeleted;
      }
      next(noPathErrorHandler(res));
    })
    .catch((err) => {
      const error = new Error('something went wrong while deleting wallet');
      error.err = err;
      next(error);
    });

  return deletedData;
};
