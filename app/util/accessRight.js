const db = require('../models');

const { User } = db;

exports.checkIfUserHasWallet = (id) =>
  User.findByPk(id)
    .then((user) => {
      if (user.walletId === null) {
        return false;
      }
      return true;
    })
    .catch(() => {
      throw new StatusError('User', 404);
    });
