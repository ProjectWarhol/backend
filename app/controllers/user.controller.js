const db = require('../models');
const { sessionObject } = require('../util/sessionObject');
const { generateToken } = require('../util/tokenGenerator');
const {
  createUser,
  findUserByUserName,
  retrieveAndUpdatePassword,
  retrieveTokenAndSetPassword,
  updateResetToken,
} = require('../service/user');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { User } = db;

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

  const confirmation = await updateResetToken(req, res, body);
  if (!confirmation || res.headersSent) return;

  next();
};

// update User password
exports.replacePassword = async (req, res) => {
  const confirmation = await retrieveTokenAndSetPassword(req, res);
  if (!confirmation || res.headersSent) return;

  res.status(200).send({
    message: 'Password Successfully updated',
  });
};

// Patch User password
exports.updatePassword = async (req, res) => {
  const confirmation = await retrieveAndUpdatePassword(req, res);
  if (!confirmation || res.headersSent) return;

  res.status(200).send({
    message: 'Password successfully updated',
  });
};

// Get User object from the username in the request
exports.retrieveOne = async (req, res) => {
  const {
    params: { userName },
  } = req;

  const data = await findUserByUserName(userName, res);
  if (!data || res.headersSent) return;

  res.status(200).send({
    message: 'User data sent successfully',
    user: sessionObject(data),
  });
};

// Create new user
exports.createOne = async (req, res) => {
  const newUser = await createUser(req, res);
  if (!newUser || res.headersSent) return;

  res.status(200).send({
    message: 'User registered succesfully',
    userId: newUser.id,
  });
};

// set updatePassword attributes
exports.expressSignup = async (req, res, next) => {
  const user = await createUser(req, res);
  if (!user || res.headersSent) return;

  req.body.id = user.id;

  next();
};
