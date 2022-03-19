/* eslint-disable consistent-return */
const db = require('../models');

const { User } = db;

const {
  defaultErrorHandler,
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

exports.updateUserWalletId = async (storedWallet, id, res, next) => {
  const state = await User.update(
    {
      walletId: storedWallet.dataValues.id,
    },
    {
      where: { id },
      returning: true,
    }
  )
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated) {
        const object = updatedUser;
        return object;
      }
      next(noPathErrorHandler(res, 'User'));
    })
    .catch(() => {
      next(
        defaultErrorHandler(res, 'Something went wrong while updating user')
      );
    });
  return state;
};
