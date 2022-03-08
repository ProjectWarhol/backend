/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const db = require('../models');
const { checkIfUserHasWallet } = require('../util/accessRight');
const {
  createCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');

const {
  User,
  UserAccount,
  Sequelize: { Op },
} = db;

const validateWalletPosession = async (res, id, next) => {
  const hasWallet = await checkIfUserHasWallet(id, res); // this should be handled by auth middleware

  if (hasWallet !== false) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }
};

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;
  validateWalletPosession(res, id, next);

  const wallet = await createCustodialWallet();
  const wallletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  const storedWallet = await UserAccount.create(wallletPublicKey).catch(
    (err) => {
      const error = new Error('Something went wrong while creating wallet');
      error.err = err;
      next(error);
    }
  );

  User.update(
    {
      walletId: storedWallet.dataValues.id,
    },
    {
      where: { id },
      returning: true,
    }
  )
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated) {
        res.status(200).send({
          message: 'Wallet successfully created',
          walletId: updatedUser.walletId,
          wallet: walletInformation,
        });
      } else {
        const error = new Error('User not found');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Something went wrong while updating user');
      error.err = err;
      next(error);
    });
};
