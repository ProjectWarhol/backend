exports.checkUserIdentity = (req, res, next) => {
  if (req.session.user.id !== req.body.userId) {
    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
  return next();
};
