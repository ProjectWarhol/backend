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

exports.findUserById = async (id, res) => {
  const user = await User.findByPk(id, { rejectOnEmpty: true }).catch(() => {
    noPathErrorHandler(res, 'User');
  });

  return user;
};

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
  const passwordHash = await User.findByPk(id)
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

exports.createUser = async (req, res) => {
  const {
    body: { userName, email, password },
  } = req;

  const id = await User.findOrCreate({
    where: {
      [Op.or]: [{ userName }, { email }],
    },
    defaults: {
      ...{ userName },
      ...{ email },
      createdAt: Date.now(),
      promoters: 0,
      promoting: 0,
      verified: false,
    },
  })
    .then(async ([newUser, created]) => {
      if (created) {
        const newPasswordHash = await bcrypt.hash(password, 12);

        // eslint-disable-next-line no-param-reassign
        newUser.passwordHash = newPasswordHash;

        newUser.save();

        return newUser;
      }
      defaultConflictHandler(res, 'Email or username already in use');
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while creating user');
    });

  return id;
};

exports.retrieveByUserName = async (userName, res) => {
  const user = await User.findOne({
    where: { userName },
  })
    .then((data) => {
      if (data) {
        return data;
      }
      noPathErrorHandler(res, 'User');
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while finding user');
    });

  return user;
};

exports.retrieveById = async (id, res) => {
  const user = await User.findByPk(id).catch(() => {
    defaultErrorHandler(res, 'something went wrong while finding user');
  });

  return user;
};

exports.retrieveByToken = async (token, res) => {
  const data = await User.findOne({
    where: {
      [Op.or]: [
        {
          resetToken: token,
        },
      ],
    },
  }).catch(() => {
    defaultErrorHandler(res, 'something went wrong while retrieving user');
  });

  if (data == null) noPathErrorHandler(res, 'token');

  return data;
};

exports.updateResetToken = async (req, res, body) => {
  const data = await User.update(body, {
    where: { email: req.body.email },
    returning: true,
  })
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated !== 1) {
        noPathErrorHandler('User', res);
      }
      res.locals.user = updatedUser;
      return updatedUser;
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating user');
    });
  return data;
};

exports.updateUser = async (req, res, id) => {
  const data = await User.update(req.body, {
    where: { id },
    returning: true,
  })
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated) {
        return updatedUser;
      }
      noPathErrorHandler('User', res);
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating user');
    });

  return data;
};
