const bcrypt = require('bcrypt');
const db = require('../models');
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
exports.updatePassword = async (req, res, next) => {
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
      if (
        data.resetTokenExp > Date.now() ||
        data.invitationExp > Date.now()
      ) {
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

// Get User object from the username in the request
exports.retrieveOne = async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  User.findOne({
    where: { id: userId },
  })
    .then(async (userData) => {
      if (userData) {
        res.status(200).send({
          message: 'User data sent successfully.',
          data: userData,
        });
      } else {
        const error = new Error('User does not exist');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Something went wrong while fetching the user.');
      error.err = err;
      next(error);
    })
};
