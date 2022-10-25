exports.userHasNotWallet = async (req, _res, next) => {
  if (req.user.walletId) {
    return next(new StatusError('User already has a wallet', 403));
  }
  return next();
};

exports.userHasWallet = async (req, res, next) => {
  if (!req.user.walletId) {
    return next(new StatusError('User has no wallet', 403));
  }
  return next();
};
