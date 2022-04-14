/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const {
  unauthorizedHandler,
  defaultWrongInputHandler,
  defaultErrorHandler,
} = require('./error_handlers.middleware');

// checks if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    unauthorizedHandler(res, 'user not logged in');
    return;
  }
  return next();
};

exports.checkLoginInput = async (req, res, next) => {
  await body('userCredential')
    .isEmail()
    .withMessage('userName')
    .matches(/^[a-z0-9-_.]{4,20}$/i)
    .withMessage('email')
    .run(req);

  if (validationResult(req).errors.length === 2) {
    return defaultWrongInputHandler(res, 'Invalid username or email');
  }
  if (validationResult(req).errors.length === 1) {
    req.body.type = validationResult(req).errors[0].msg;
    return next();
  }

  return defaultErrorHandler(res, 'Something went wrong');
};
