const db = require('../models');
const {
  createCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/update.user');
const { decryptPrivateKey } = require('../blockchain/wallet/custodial_wallet');
const { walletObject } = require('../util/walletObject');

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

exports.retrieveWallet = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  UserAccount.findOne({
    where: { id },
  })
    .then(async (account) => {
      const encryptedKey = walletObject(account);
      const privateKey = await decryptPrivateKey(encryptedKey, password);

      res.status(200).send({
        message: 'wallet successfully sent',
        walletId: account.id,
        publicKey: account.publicKey,
        privateKey,
      });
    })
    .catch((err) => {
      const error = new Error('Something went wrong while retrieving wallet');
      error.err = err;
      next(error);
    });
};
