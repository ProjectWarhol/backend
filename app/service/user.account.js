/* eslint-disable consistent-return */
const db = require('../models');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { UserAccount } = db;

exports.addWalletToDatabase = async (walletPublicKey, res, next) => {
  const account = await UserAccount.create(walletPublicKey).catch((err) => {
    next(
      defaultErrorHandler(
        err,
        res,
        'Something went wrong while creating wallet'
      )
    );
  });
  return account;
};

exports.updateWallet = async (encryptedData, id, res, next) => {
  const updateData = await UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  }).catch((err) => {
    next(
      defaultErrorHandler(
        err,
        res,
        'Something went wrong while updating wallet'
      )
    );
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
      next(
        defaultErrorHandler(
          err,
          res,
          'something went wrong while deleting wallet'
        )
      );
    });

  return deletedData;
};