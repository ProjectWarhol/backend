/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');
const {
  defaultErrorHandler,
  defaultExpirationHandler,
  defaultConflictHandler,
} = require('../middlewares/error_handlers.middleware');

const { User } = db;

// login user and return sessionToken as cookie
exports.login = (req, res) => {
  const { userCredential, password, type } = req.body;

  const defaulLoginError = new Error('Wrong email or password');
  defaulLoginError.status = 401;

  User.findOne({
    where: { [type]: userCredential },
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
          defaultConflictHandler(res, 'password does not match');
        }
      });
    })
    .catch(() => {
      defaultErrorHandler(res, 'something went wrong while finding user');
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
exports.validateSession = (req, res) => {
  const currentUser = req.session.user;
  const currentCookieDate = req.session.cookie._expires;
  const dateTime = new Date();

  if (currentUser && currentCookieDate >= dateTime.now()) {
    return res.status(200).send({
      message: 'Valid session',
      user: currentUser,
    });
  }
  res.status(401).clearCookie('my.sid', { path: '/' });
  req.session.destroy();
  defaultExpirationHandler(res, 'session');
};

exports.expressValidationResponse = (req, res) => {
  res.status(200).send({
    message: 'Express signup complete',
    userId: req.body.id,
    walletId: req.body.walletId,
    walletInformation: req.body.walletInformation,
    mnemonicPhrase: req.body.mnemonicPhrase,
  });
};
