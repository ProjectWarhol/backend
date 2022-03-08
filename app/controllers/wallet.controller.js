const db = require('../models');
const {
  createCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');

const { User, UserAccount } = db;

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;
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
