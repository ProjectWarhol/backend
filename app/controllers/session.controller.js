// validate existing session from client
exports.validateSession = (req, res, next) => {
  const { user } = req;

  if (user) {
    return res.status(200).json({
      message: 'Valid session',
      user: user.stripSensitive(),
    });
  }

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
