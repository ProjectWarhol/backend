/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');

// checks if user is logged in
exports.isLoggedIn = (req, _res, next) => {
  if (!req.session.user) {
    return next(new StatusError('User not logged in', 403));
  }
  return next();
};

exports.checkLoginInput = async (req, _res, next) => {
  await body('userCredential')
    .isEmail()
    .withMessage('userName')
    .matches(/^[a-z0-9-_.]{4,20}$/i)
    .withMessage('email')
    .run(req);

  if (validationResult(req).errors.length === 2) {
    return next(new StatusError('Invalid username or email', 422));
  }
  if (validationResult(req).errors.length === 1) {
    req.body.type = validationResult(req).errors[0].msg;
    return next();
  }

  return next(new StatusError('Something went wrong', 500));
};
