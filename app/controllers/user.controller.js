const db = require('../models');

const { User } = db;

// Update a user
exports.updateOne = (req, res, next) => {
  const { user } = req;

  user
    .update(req.body)
    .then((updatedUser) => {
      return res.status(200).send({
        message: 'User was updated successfully',
        user: updatedUser.stripSensitive(),
      });
    })
    .catch((err) => next(err));
};

// set updatePassword attributes
exports.setResetToken = (req, res, next) => {
  const {
    body: { email },
  } = req;

  User.findByLogin('email', email)
    .then((user) => user.setResetToken())
    .then((token) => {
      res.locals.resetToken = token;
      return next();
    })
    .catch((err) => next(err));
};

// update User password
exports.replacePassword = (req, res, next) => {
  const {
    body: { password },
    params: { token },
  } = req;

  User.findByToken(token)
    .then((user) => {
      if (user.resetTokenExp < Date.now()) {
        throw new StatusError('Token expired', 401);
      }
      return user.setPassword(password);
    })
    .then(() => {
      return res.status(200).send({
        message: 'Password successfully updated',
      });
    })
    .catch((err) => next(err));
};

// Patch User password
exports.updatePassword = (req, res, next) => {
  const {
    user,
    body: { oldPassword, newPassword },
  } = req;

  user
    .replacePassword(oldPassword, newPassword)
    .then(() => {
      return res.status(200).send({
        message: 'Password successfully updated',
      });
    })
    .catch((err) => next(err));
};

// Get User object from the username in the request
exports.retrieveOne = (req, res, next) => {
  const {
    params: { userName },
  } = req;

  User.findByLogin('userName', userName)
    .then((user) => {
      return res.status(200).send({
        message: 'User data sent successfully',
        user: user.stripSensitive(),
      });
    })
    .catch((err) => next(err));
};

// set updatePassword attributes
exports.expressSignup = (req, res, next) => {
  const {
    body: { userName, email, password },
  } = req;

  User.createNewUser(userName, email, password)
    .then((user) => {
      res.locals.user = user;
      req.body.userCredential = userName;
      return next();
    })
    .catch((err) => next(err));
};
