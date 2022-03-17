const db = require('../models');

const { User } = db;

const {
  defaultErrorHandler,
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
      return false;
    })
    .catch((err) => {
      next(
        defaultErrorHandler(
          err,
          res,
          'Something went wrong while updating user'
        )
      );
    });
  return state;
};
