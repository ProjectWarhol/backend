const session = require('express-session');

require('dotenv').config();

exports.session = (sequelizeSessionStore) => {
  session({
    name: 'my.sid',
    store: sequelizeSessionStore,
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: ['staging', 'production'].includes(process.env.NODE_ENV)
        ? 'none'
        : 'lax',
      secure: ['staging', 'production'].includes(process.env.NODE_ENV),
      maxAge: 1000 * 60 * 60 * 24, // oneDay in milliseconds
    },
  });
};
