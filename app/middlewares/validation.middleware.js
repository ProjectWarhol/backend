const { body, validationResult } = require('express-validator');

exports.checkEmail = (req, _res, next) => {
  return body('email')
    .isEmail()
    .run(req)
    .then(() => {
      if (!validationResult(req).isEmpty())
        return next(new StatusError('Invalid email', 422));
      return next();
    });
};
