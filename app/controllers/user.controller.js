const bcrypt = require('bcrypt');
const { sessionObject } = require('../util/sessionObject');
const { generateToken } = require('../util/tokenGenerator');
const {
  createUser,
  retrieveByUserName,
  retrieveById,
  retrieveByToken,
  updateResetToken,
  getUserPasswordHash,
  updateUser,
} = require('../service/user');
const {
  defaultErrorHandler,
  defaultExpirationHandler,
} = require('../middlewares/error_handlers.middleware');

// Update a user by the id in the request
exports.updateOne = async (req, res) => {
  const {
    params: { id },
  } = req;

  const data = await updateUser(req, res, id);
  if (!data || res.headersSent) return;

  res.status(200).send({
    message: 'User was updated successfully',
    user: sessionObject(data),
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
  const {
    body: { password },
    params: { token },
  } = req;

  const user = await retrieveByToken(token, res);
  if (user.resetTokenExp < Date.now()) {
    defaultExpirationHandler(res, 'Password token');
  }
  if (!user || res.headersSent) return;

  const newPasswordHash = await bcrypt.hash(password, 12);
  user.passwordHash = newPasswordHash;
  user.resetToken = null;
  user.resetTokenExp = null;
  user.save().catch(() => {
    defaultErrorHandler(res, 'Something went wrong while updating user');
  });

  res.status(200).send({
    message: 'Password Successfully updated',
  });
};

// Patch User password
exports.updatePassword = async (req, res) => {
  const {
    body: { id, oldPassword, newPassword },
  } = req;

  const result = await getUserPasswordHash(id, res, oldPassword);
  const user = await retrieveById(id, res);
  if (!user || !result || res.headersSent) return;

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  user.passwordHash = newPasswordHash;
  user.save();

  res.status(200).send({
    message: 'Password successfully updated',
  });
};

// Get User object from the username in the request
exports.retrieveOne = async (req, res) => {
  const {
    params: { userName },
  } = req;

  const data = await retrieveByUserName(userName, res);
  if (!data || res.headersSent) return;

  res.status(200).send({
    message: 'User data sent successfully',
    user: sessionObject(data),
  });
};

// set updatePassword attributes
exports.expressSignup = async (req, res, next) => {
  const user = await createUser(req, res);
  if (!user || res.headersSent) return;

  req.body.id = user.id;

  next();
};
