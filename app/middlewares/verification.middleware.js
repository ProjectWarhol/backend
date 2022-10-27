exports.userHasNotWallet = (req, _res, next) => {
  const { walletId } = req.user;

  if (walletId) {
    return next(new StatusError('User already has a wallet', 403));
  }
  return next();
};

exports.userHasWallet = (req, _res, next) => {
  const { walletId } = req.user;

  if (!walletId) {
    return next(new StatusError('User has no wallet', 403));
  }
  return next();
};
