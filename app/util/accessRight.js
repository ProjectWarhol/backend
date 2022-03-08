const errHandler = require('../middlewares/error_handlers.middleware');
const db = require('../models');

const { User } = db;

exports.checkIfUserHasWallet = (id, next) => {
  let result;

  User.findByPk(id)
    .then((user) => {
      if (!user.walletId) {
        result = false;
      }
      result = true;
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });

  return result;
};
