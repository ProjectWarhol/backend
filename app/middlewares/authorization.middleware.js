// checks if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error('Unauthorized user not logged in');
    error.status = 403;
    return next(error);
  }
  return next();
};
