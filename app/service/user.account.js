/* eslint-disable consistent-return */
const db = require('../models');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { UserAccount } = db;

exports.addWalletToDatabase = async (walletPublicKey, res, next) => {
  let error;

  const account = await UserAccount.create(walletPublicKey).catch((err) => {
    error = err;
  });

  if (
    typeof account.dataValues.publicKey !== 'undefined' &&
    account.dataValues.publicKey !== null
  ) {
    return account;
  }
  next(
    defaultErrorHandler(
      error,
      res,
      'Something went wrong while creating wallet'
    )
  );
};

exports.updateWallet = async (encryptedData, id, res, next) => {
  let error;

  const updateData = await UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  }).catch((err) => {
    error = err;
  });

  if (updateData[0] === 0) {
    next(
      defaultErrorHandler(
        error,
        res,
        'Something went wrong while updating wallet'
      )
    );
  }
  return updateData;
};

exports.findWalletById = async (id, next) => {
  const userAccount = await UserAccount.findByPk({ where: { id } }).catch(
    (err) => {
      const error = new Error('Something went wrong while retrieving wallet');
      error.err = err;
      next(error);
    }
  );

  return userAccount;
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
