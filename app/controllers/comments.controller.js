const { Sequelize } = require('../models');
const db = require('../models');

const {
  Sequelize: { Op },
} = db;

// Get all users that a user with promoterId promotes
exports.retrieveComments = (req, res, next) => {
  const {
    body: { id },
  } = req;

};

// Get all users that a user with promoterId promotes
exports.createComment = (req, res, next) => {
  const {
    body: { id },
  } = req;

};
