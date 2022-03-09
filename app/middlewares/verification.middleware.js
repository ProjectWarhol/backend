const { checkIfUserHasWallet } = require('../util/accessRight');

exports.validateWalletPosession = async (req, res, next) => {
  const { id } = req.body;
  const hasWallet = await checkIfUserHasWallet(id, res);

  if (hasWallet !== false) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }
  return next();
};
