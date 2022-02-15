const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');

const { User } = db;

const validateEmailInput = (errors, next) => {
  if (!errors.isEmpty()) {
    const error = new Error('Invalid email format entered');
    error.status = 422;
    next(error);
  }
};

// login user and return sessionToken as cookie
exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  validateEmailInput(errors, next);
  const defaulLoginError = new Error('Wrong email or password');
  defaulLoginError.status = 401;

  User.findOne({
    where: { email },
  })
    .then((data) => {
      bcrypt.compare(password, data.passwordHash).then((doMatch) => {
        // change to salterpassword
        if (doMatch === true) {
          const newSessionUser = sessionObject(data);
          req.session.user = newSessionUser;
          req.session.save();
          res.status(200).send({
            message: 'Successfully logged in',
            user: newSessionUser,
          });
        } else {
          next(defaulLoginError);
        }
      });
    })
    .catch((err) => {
      defaulLoginError.err = err;
      next(defaulLoginError);
    });
};

// log out user & destroy session
exports.logout = (req, res) => {
  res.status(200).clearCookie('my.sid', { path: '/' });
  req.session.destroy();
  res.send({
    message: 'Successfully logged out',
  });
};

// validate existing session from client
exports.validateSession = (req, res, next) => {
  const currentUser = req.session.user;
  if (currentUser) {
    return res.status(200).send({
      message: 'Valid session',
      user: currentUser,
    });
  }
  const error = new Error('Unauthorized');
  error.status = 401;
  return next(error);
};
