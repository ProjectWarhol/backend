const db = require('../models');

const { User } = db;

exports.updateUserWalletId = async (next, storedWallet, id) => {
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
      const error = new Error('Something went wrong while updating user');
      error.err = err;
      next(error);
    });
  return state;
};
