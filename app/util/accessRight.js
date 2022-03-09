const db = require('../models');

const { User } = db;

exports.checkIfUserHasWallet = async (id, res) => {
  const result = await User.findByPk(id)
    .then((user) => {
      if (user.walletId !== null) {
        return true;
      }
      return false;
    })
    .catch(() => {
      res.status(500).send({
        message: 'Something went wrong while checking user',
      });
    });
  return result;
};
