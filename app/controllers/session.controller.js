const db = require('../models');

const { User } = db;

// login user and return sessionToken as cookie
exports.login = (req, res, next) => {
  const { userCredential, password, type } = req.body;

  User.findByLogin(type, userCredential)
    .catch(() => {
      throw new StatusError('Wrong credentials', 403);
    })
    .then((user) => {
      return user.login(password, req);
    })
    .then(() => {
      return res.status(200).send({
        message: 'Successfully logged in',
        user: req.session.user,
      });
    })
    .catch((err) => next(err));
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

  res.clearCookie('my.sid', { path: '/' });
  req.session.destroy();
  return next(new StatusError('Invalid session', 403));
};

exports.expressValidationResponse = (req, res, _next) => {
  return res.status(200).send({
    message: 'Express signup complete',
    userId: req.body.id,
    walletId: req.body.walletId,
    walletInformation: req.body.walletInformation,
    mnemonicPhrase: req.body.mnemonicPhrase,
  });
};
