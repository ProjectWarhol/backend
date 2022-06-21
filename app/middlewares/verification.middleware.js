const { checkIfUserHasWallet } = require('../util/accessRight');

exports.userHasNotWallet = async (req, _res, next) => {
  const { id } = req.body;

  let hasWallet;
  try {
    hasWallet = await checkIfUserHasWallet(id);
  } catch (err) {
    return next(err);
  }

  if (hasWallet) {
    return next(new StatusError('User already has a wallet', 403));
  }
  return next();
};

exports.userHasWallet = async (req, res, next) => {
  const { id } = req.body;

  let hasWallet;
  try {
    hasWallet = await checkIfUserHasWallet(id);
  } catch (err) {
    return next(err);
  }

  if (!hasWallet) {
    return next(new StatusError('User has no wallet', 403));
  }
  return next();
};
