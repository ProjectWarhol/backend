// checks if user is logged in
exports.isLoggedIn = (req, _res, next) => {
  if (!req.user) {
    return next(new StatusError('User not logged in', 403));
  }
  return next();
};
