/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const db = require('../models');

const { User } = db;

const {
  defaultErrorHandler,
  noPathErrorHandler,
  defaultPasswordMismatch,
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

exports.getUserPasswordHash = async (req, res, password) => {
  const passwordHash = await User.findByPk(req.body.id)
    .then((user) => user.passwordHash)
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating user');
    });
  const result = await bcrypt.compare(password, passwordHash);
  if (!result) {
    defaultPasswordMismatch(res, 'password do not match');
  }
  return passwordHash;
};
