const db = require('../models');
const {
  createCustodialWallet,
  storeCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/update.user');
const { privateKeyObject } = require('../util/privateKeyObject');

const { UserAccount } = db;

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;
  const wallet = await createCustodialWallet();
  const walletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  const storedWallet = await UserAccount.create(walletPublicKey).catch(
    (err) => {
      const error = new Error('Something went wrong while creating wallet');
      error.err = err;
      next(error);
    }
  );

  const userObject = await updateUserWalletId(next, storedWallet, id);

  if (userObject === false) {
    res.status(404).send({
      message: 'User not found',
    });
  }
  res.status(200).send({
    message: 'Wallet successfully created',
    walletId: userObject.walletId,
    wallet: walletInformation,
  });
};

exports.storePrivateKey = async (req, res, next) => {
  const { id } = req.params;
  const wallet = {
    address: req.body.address,
    privateKey: req.body.privateKey,
    index: req.body.index,
  };
  const { password } = req.body;

  const encryptedObject = await storeCustodialWallet(wallet, password);
  const encryptedData = privateKeyObject(encryptedObject);

  UserAccount.update(encryptedData, {
    where: { id },
    returning: true,
  })
    .then(([rowsUpdated]) => {
      if (rowsUpdated) {
        res.status(200).send({
          message: 'Private key successfully stored',
        });
      } else {
        const error = new Error('wallet not found');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error('Something went wrong while updating wallet');
      error.err = err;
      next(error);
    });
};
