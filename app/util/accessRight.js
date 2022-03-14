const db = require('../models');

const { User } = db;

exports.checkIfUserHasWallet = async (id, res) => {
  const result = await User.findByPk(id)
    .then((user) => {
      if (user.walletId === null) {
        return false;
      }
      return true;
    })
    .catch(() => {
      res.status(404).send({
        message: 'User not found',
      });
    });
  return result;
};
