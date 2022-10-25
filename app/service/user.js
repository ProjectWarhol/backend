/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
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
      noPathErrorHandler(res, 'User');
    })
    .catch(() => {
      next(
        defaultErrorHandler(res, 'Something went wrong while updating user')
      );
    });
  return state;
};

exports.getUserPasswordHash = async (id, res, password) => {
  const user = await User.findByPk(id).catch(() => {
    noPathErrorHandler('User', res);
  });

  const result = await bcrypt.compare(password, user.passwordHash);

  if (!result) {
    defaultPasswordMismatch(res, 'password do not match');
  }

  return user.passwordHash;
};

exports.updateUser = async (req, res, id) => {
  const data = await User.update(req.body, {
    where: { id },
    returning: true,
  }).catch(() => {
    defaultErrorHandler(res, 'Something went wrong while updating user');
  });

  if (!data[0]) noPathErrorHandler('User', res);

  return data;
};
