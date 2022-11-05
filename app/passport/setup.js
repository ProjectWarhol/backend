const db = require('../models');

const { User } = db;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
      if (!user) return done('User not found');
      return done(null, user);
    });
  });
};
