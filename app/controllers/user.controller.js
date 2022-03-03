const bcrypt = require('bcrypt');
const db = require('../models');
const errHandler = require('../middlewares/error_handlers.middleware');
const { sessionObject } = require('../util/sessionObject');
const { generateToken } = require('../util/tokenGenerator');

const {
  User,
  Sequelize: { Op },
} = db;

// Update a user by the id in the request
exports.updateOne = (req, res, next) => {
  const {
    params: { id },
  } = req;

  User.update(req.body, {
    where: { id },
    returning: true,
  })
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated) {
        res.status(200).send({
          message: 'User was updated successfully',
          user: updatedUser,
        });
      } else {
        const error = new Error('User not found');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Something went wrong while updating user');
      error.err = err;
      next(error);
    });
};

// set updatePassword attributes
exports.setResetToken = async (req, res, next) => {
  const body = {
    resetTokenExp: Date.now() + 3600000,
    resetToken: await generateToken(),
  };

  User.update(body, {
    where: { email: req.body.email },
    returning: true,
  })
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated === 1) {
        res.locals.user = updatedUser;
        next();
      } else {
        const error = new Error('User does not exist');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Something went wrong while updating user');
      error.err = err;
      next(error);
    });
};

// update User password
exports.replacePassword = async (req, res, next) => {
  const {
    body: { password },
    params: { token },
  } = req;

  User.findOne({
    where: {
      [Op.or]: [
        {
          resetToken: token,
        },
      ],
    },
  })
    .then(async (data) => {
      if (data.resetTokenExp > Date.now() || data.invitationExp > Date.now()) {
        const newPasswordHash = await bcrypt.hash(password, 12);

        // eslint-disable-next-line no-param-reassign
        data.passwordHash = newPasswordHash;
        // eslint-disable-next-line no-param-reassign
        data.resetToken = null;
        // eslint-disable-next-line no-param-reassign
        data.resetTokenExp = null;

        data
          .save()
          .then(() => {
            res.status(200).send({
              message: 'Password Successfully updated',
            });
          })
          .catch((err) => {
            const error = new Error('Something went wrong while updating user');
            error.err = err;
            next(error);
          });
      } else {
        const error = new Error('Password token expired');
        error.status = 401;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Invalid token');
      error.status = 409;
      error.err = err;
      next(error);
    });
};

// Patch User password
exports.updatePassword = async (req, res, next) => {
  const {
    body: { id, oldPassword, newPassword },
  } = req;

  User.findByPk(id)
    .then((data) => {
      bcrypt.compare(oldPassword, data.passwordHash).then(async (doMatch) => {
        if (doMatch === true) {
          const newPasswordHash = await bcrypt.hash(newPassword, 12);

          // eslint-disable-next-line no-param-reassign
          data.passwordHash = newPasswordHash;

          data.save().then(() => {
            res.status(200).send({
              message: 'Password successfully updated',
            });
          });
        } else {
          const error = new Error("Password doesn't match");
          error.status = 401;
          next(error);
        }
      });
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });
};

// Get User object from the username in the request
exports.retrieveOne = async (req, res, next) => {
  const {
    body: { id },
  } = req;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: 'User data sent successfully',
          user: sessionObject(data),
        });
      } else {
        next(errHandler.noPathErrorHandler);
      }
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });
};

// Create new user
exports.createOne = async (req, res, next) => {
  const {
    body: { userName, email, password },
  } = req;

  User.findOrCreate({
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

        newUser
          .save()
          .then(() => {
            res.status(200).send({
              message: 'User registered succesfully',
            });
          })
          .catch((err) => {
            next(errHandler.defaultErrorHandler(err));
          });
      } else {
        res.status(409).send({
          message: 'Email or username already in use',
        });
      }
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });
};
