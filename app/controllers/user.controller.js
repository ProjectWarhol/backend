const bcrypt = require('bcrypt');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');
const { generateToken } = require('../util/tokenGenerator');
const { createUser } = require('../service/user');
const {
  defaultWrongInputHandler,
  noPathErrorHandler,
  defaultErrorHandler,
  defaultExpirationHandler,
  defaultConflictHandler,
} = require('../middlewares/error_handlers.middleware');

const {
  User,
  Sequelize: { Op },
} = db;

// Update a user by the id in the request
exports.updateOne = (req, res) => {
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
        noPathErrorHandler('User', res);
      }
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating user');
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
        noPathErrorHandler('User', res);
      }
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating user');
    });
};

// update User password
exports.replacePassword = async (req, res) => {
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
          .catch(() => {
            defaultErrorHandler(
              res,
              'Something went wrong while updating user'
            );
          });
      } else {
        defaultExpirationHandler(res, 'Password token');
      }
    })
    .catch(() => {
      defaultConflictHandler(res, 'Invalid token');
    });
};

// Patch User password
exports.updatePassword = async (req, res) => {
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
          defaultConflictHandler(res, "Password doesn't match");
        }
      });
    })
    .catch(() => {
      defaultWrongInputHandler(res, 'something went wrong while finding user');
    });
};

// Get User object from the username in the request
exports.retrieveOne = async (req, res) => {
  const {
    params: { userName },
  } = req;

  User.findOne({
    where: { userName },
  })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: 'User data sent successfully',
          user: sessionObject(data),
        });
      } else {
        noPathErrorHandler(res, 'User');
      }
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while finding user');
    });
};

// Create new user
exports.createOne = async (req, res) => {
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
              userId: newUser.id,
            });
          })
          .catch(() => {
            defaultErrorHandler(
              res,
              'something went wrong while creating user'
            );
          });
      } else {
        defaultConflictHandler(res, 'Email or username already in use');
      }
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while creating user');
    });
};

// set updatePassword attributes
exports.expressSignup = async (req, res, next) => {
  const user = await createUser(req, res);
  if (!user || res.headersSent) return;

  req.body.id = user.id;

  next();
};
