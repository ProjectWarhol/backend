/* eslint-disable consistent-return */
const db = require('../models');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { UserAccount } = db;

exports.addWalletToDatabase = async (walletPublicKey, res, next) => {
  const account = await UserAccount.create(walletPublicKey).catch((err) => {
    console.log(err);
  });

  if (
    typeof account.dataValues.publicKey !== 'undefined' &&
    account.dataValues.publicKey !== null
  ) {
    return account;
  }
  next(defaultErrorHandler(res, 'Something went wrong while creating wallet'));
};

exports.updateWallet = async (encryptedData, id, res, next) => {
  const updateData = await UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  }).catch((err) => {
    console.log(err);
  });

  if (updateData[0] === 0) {
    next(
      defaultErrorHandler(res, 'Something went wrong while updating wallet')
    );
  }
  return updateData;
};

exports.findWalletById = async (id, res, next) => {
  const userAccount = await UserAccount.findByPk({ where: { id } }).catch(
    () => {
      next(
        defaultErrorHandler(
          res,
          'something went wrong while retrieving the wallet'
        )
      );
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
    .catch(() => {
      next(
        defaultErrorHandler(res, 'something went wrong while deleting wallet')
      );
    });

  return deletedData;
};
