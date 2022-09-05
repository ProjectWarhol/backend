/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const db = require('../models');

const {
  User,
  Sequelize: { Op },
} = db;
const {
  defaultErrorHandler,
  noPathErrorHandler,
  defaultPasswordMismatch,
  defaultConflictHandler,
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

exports.createUser = async (req, res) => {
  const {
    body: { userName, email, password },
  } = req;

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOrCreate({
    where: {
      [Op.or]: [{ userName }, { email }],
    },
    defaults: {
      ...{ userName },
      ...{ email },
      ...{ passwordHash },
      createdAt: Date.now(),
      promoters: 0,
      promoting: 0,
      verified: false,
    },
  }).catch(() => {
    defaultErrorHandler(res, 'something went wrong while creating user');
  });

  if (!user[1]) {
    defaultConflictHandler(res, 'Email or username already in use');
  }

  return user[0];
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
