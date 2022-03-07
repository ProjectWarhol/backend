const errHandler = require('../middlewares/error_handlers.middleware');
const db = require('../models');

const { User } = db;

exports.checkIfUserHasWallet = (id, next) => {
  User.findOne({ id }, (_err, user) => {
    if (!user.walletId) {
      return true;
    }
    return false;
  }).catch((err) => {
    next(errHandler.defaultErrorHandler(err));
  });
};
