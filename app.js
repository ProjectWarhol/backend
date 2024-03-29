const express = require('express');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const RedisStore = require('rate-limit-redis');
// const rateLimit = require('express-rate-limit');
// const RedisClient = require('ioredis');
const mainRoute = require('./app/routes/main');
const {
  noPathHandler,
  errorHandler,
} = require('./app/middlewares/error_handlers.middleware');
const { setHeaders } = require('./app/middlewares/headers.middleware');
const db = require('./app/models');

require('dotenv').config();
require('./app/passport/setup')(passport);
require('./app/passport/strategies').register(passport);

// const env = process.env.NODE_ENV || 'development';

const app = express();
app.disable('x-powered-by');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: '*', // TEMP, change to production domain
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );

  app.set('trust proxy', 1);
}

const sequelizeSessionStore = new SequelizeStore({
  db: db.sequelize,
  table: 'Session',
  tableName: 'Session',
});

app.use(
  session({
    name: 'my.sid',
    store: sequelizeSessionStore,
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: ['production'].includes(process.env.NODE_ENV) ? 'none' : 'lax',
      secure: ['production'].includes(process.env.NODE_ENV),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    },
  })
);
// if (env !== 'production') {
//   const client = new RedisClient({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: process.env.REDIS_PORT || 6379,
//   });

app.use(passport.initialize());
app.use(passport.session());

//   const reqLimiter = rateLimit({
//     windowMs: (process.env.REQ_WINDOW_MINUTES || 1) * 60 * 1000,
//     max: process.env.MAX_REQ || 50,
//     legacyHeaders: false,
//     store: new RedisStore({
//       sendCommand: (...args) => client.call(...args),
//     }),
//   });
//   app.use(reqLimiter);
// }
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to db established');
    db.sequelize.sync({ alter: true });
  })
  .catch((err) => console.error(err));

app.use(require('sanitize').middleware);

app.use(setHeaders);

app.use(mainRoute);
app.use(noPathHandler);
app.use(errorHandler);

module.exports = app;

const port = Number(process.env.PORT) || 3000;
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Listening on port ${port}`);
