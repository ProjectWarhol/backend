const express = require('express');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const mainRoute = require('./app/routes/main');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('./app/middlewares/error_handlers.middleware');
const { setup } = require('./app/util/bcProvider');

const db = require('./app/models');

require('dotenv').config();

setup()

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

if (['staging', 'production'].includes(process.env.NODE_ENV)) {
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
      sameSite: ['staging', 'production'].includes(process.env.NODE_ENV)
        ? 'none'
        : 'lax',
      secure: ['staging', 'production'].includes(process.env.NODE_ENV),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    },
  })
);

app.use(
  fileupload({
    createParentPath: true,
  })
);

app.use(require('sanitize').middleware);

app.use(mainRoute);
app.use(noPathErrorHandler);
app.use(defaultErrorHandler);

db.sequelize.sync({ alter: true });

module.exports = app;

const port = Number(process.env.PORT) || 3000;
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Listening on port ${port}`);
