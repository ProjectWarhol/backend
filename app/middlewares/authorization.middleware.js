const { body } = require('express-validator');
const {
  unauthorizedHandler,
  defaultWrongInputHandler,
} = require('./error_handlers.middleware');

const usernameRegExp = new RegExp('^[a-zA-Z0-9-_.]{4,20}$');

// checks if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    unauthorizedHandler(res, 'user not logged in');
  }
  return next();
};

exports.checkLoginInput = async (req, res, next) => {
  const { errors } = await body('userCredential').isEmail().run(req);

  if (!errors.length) {
    req.body.type = 'email';
  } else if (usernameRegExp.test(req.body.userCredential)) {
    req.body.type = 'userName';
  } else {
    defaultWrongInputHandler(res, 'Invalid username or email');
  }
  return next();
};
