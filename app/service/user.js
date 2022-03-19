/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const db = require('../models');
const errHandler = require('../middlewares/error_handlers.middleware');

const {
  User,
  Sequelize: { Op },
} = db;
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

exports.createUser = async (req, res, next) => {
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

        return newUser.id;
      }
      res.status(409).send({
        message: 'Email or username already in use',
      });
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });

  return id;
};
