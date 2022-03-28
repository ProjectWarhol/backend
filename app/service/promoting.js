const { Sequelize } = require('../models');
const { sessionObject } = require('../util/sessionObject');
const db = require('../models');
const {
  defaultErrorHandler,
  defaultConflictHandler,
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { User, Promoting } = db;
