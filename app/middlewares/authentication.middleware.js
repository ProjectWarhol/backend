exports.checkUserIdentity = (req, _res, next) => {
  if (req.session.user.id !== req.body.userId) {
    return next(new StatusError('Invalid userId', 401));
  }
  return next();
};
