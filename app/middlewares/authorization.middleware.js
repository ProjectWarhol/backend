const { body } = require('express-validator');

const usernameRegExp = new RegExp('^[a-zA-Z0-9-_.]{4,20}$');

// checks if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error('Unauthorized user not logged in');
    error.status = 403;
    return next(error);
  }
  return next();
};

exports.checkLoginInput = async (req, res, next) => {
  const { errors } = await body('name').isEmail().run(req);

  if (!errors.length) {
    req.body.type = 'email';
  } else if (usernameRegExp.test(req.body.name)) {
    req.body.type = 'userName';
  } else {
    const error = new Error('Invalid username or email');
    error.status = 403;
    return next(error);
  }
  return next();
}
