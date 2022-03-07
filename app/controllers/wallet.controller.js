/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const db = require('../models');
const { checkIfUserHasWallet } = require('../util/accessRight');

const {
  UserAccount,
  Sequelize: { Op },
} = db;

exports.CreateWallet = async (req, res, next) => {
  const { id } = req.body;

  const hasWallet = await checkIfUserHasWallet(id, next);
};
