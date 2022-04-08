/* eslint-disable consistent-return */
const db = require('../models');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { UserAccount } = db;

exports.addWalletToDatabase = async (walletPublicKey, res) => {
  const account = await UserAccount.create(walletPublicKey).catch((err) => {
    console.log(err);
  });

  if (
    typeof account.dataValues.publicKey !== 'undefined' &&
    account.dataValues.publicKey !== null
  ) {
    return account;
  }
  defaultErrorHandler(res, 'Something went wrong while creating wallet');
};

exports.updateWallet = async (encryptedData, id, res) => {
  const updateData = await UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  }).catch((err) => {
    console.log(err);
  });

  if (updateData[0] === 0) {
    defaultErrorHandler(res, 'Something went wrong while updating wallet');
  }
  return updateData;
};

exports.findWalletById = async (id, res) => {
  try {
    const userAccount = await UserAccount.findByPk(id);
    return userAccount;
  } catch {
    defaultErrorHandler(
      res,
      'something went wrong while retrieving the wallet'
    );
  }
};

exports.deleteWallet = async (id, res) => {
  const deletedData = await UserAccount.destroy({
    where: { id },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 1) {
        return rowsDeleted;
      }
      noPathErrorHandler(res, 'wallet');
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while deleting wallet');
    });

  return deletedData;
};
