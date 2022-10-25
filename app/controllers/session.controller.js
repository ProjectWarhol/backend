// login user and return sessionToken as cookie
exports.login = (req, res, _next) => {
  res.status(200).json(req.user.stripSensitive())
};

// log out user & destroy session
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.clearCookie('my.sid', { path: '/' }).status(200).send("Successfully logged out");
  });
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
