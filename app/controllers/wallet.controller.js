/* eslint-disable no-unused-vars */
const db = require('../models');
const { checkIfUserHasWallet } = require('../util/accessRight');
const {
  createCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');

const {
  UserAccount,
  Sequelize: { Op },
} = db;

const validateWalletPosession = async (res, id) => {
  const hasWallet = await checkIfUserHasWallet(id, res); // this should be handled by auth middleware

  if (hasWallet !== false) {
    res.status(403).send({
      message: 'forbiddent',
    });
  }
};

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;
  validateWalletPosession(res, id);

  const wallet = await createCustodialWallet();
  const wallletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  UserAccount.create(wallletPublicKey)
    .then((data) => {
      res.status(200).send({
        message: 'Wallet successfully created',
        walletId: data.id,
        wallet: walletInformation,
      });
    })
    .catch((err) => {
      const error = new Error('Something went wrong while creating wallet');
      error.err = err;
      next(error);
    });
};
