/* eslint-disable no-unused-vars */
const db = require('../models');
const { checkIfUserHasWallet } = require('../util/accessRight');
const {
  createCustodialWallet,
} = require('../blockchain/wallet/CustodialWallet');

const {
  UserAccount,
  Sequelize: { Op },
} = db;

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;

  const hasWallet = await checkIfUserHasWallet(id, next); // this should be handled by auth middleware

  if (!hasWallet) {
    const wallet = await createCustodialWallet();
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const wallletInfo = wallet.wallet[0].address;

    UserAccount.create(wallletInfo)
      .then((data) => {
        res.send({
          message: 'Wallet successfully created',
          walletInfo: data,
        });
      })
      .catch((err) => {
        const error = new Error('Something went wrong while creating wallet');
        error.err = err;
        next(error);
      });
  }

  next();
};
