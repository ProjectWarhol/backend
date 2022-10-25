const bcrypt = require('bcrypt');
const {
  createCustodialWallet,
  encryptPrivateKey,
} = require('./custodial_wallet');
const { decryptPrivateKey } = require('./custodial_wallet');
const { walletObject } = require('../util/walletObject');
const { encryptedWalletObject } = require('../util/walletObject');
const db = require('../models');

const { UserAccount } = db;

// create a wallet with private/public keys
exports.createWallet = (_req, res, next) => {
  return createCustodialWallet()
    .then(([wallet, seedPhrase]) => {
      res.locals.wallet = wallet;
      res.locals.mnemonicPhrase = seedPhrase;
      return wallet.address;
    })
    .then((publicKey) => UserAccount.create({ publicKey }))
    .then((userAccount) => {
      res.locals.userAccount = userAccount;
      return res.locals.user.update({ walletId: userAccount.id });
    })
    .then(() => next())
    .catch((err) => next(err));
};

// encrypt privateKey with private/public key and password and store
exports.storePrivateKey = async (req, res, next) => {
  const {
    body: { password },
  } = req;

  const { passwordHash } = res.locals.user;

  const wallet = {
    address: res.locals.wallet.address,
  };

  bcrypt
    .hash(res.locals.mnemonicPhrase, passwordHash)
    .then((mnemonicHash) => {
      wallet.mnemonicHash = mnemonicHash;
      return encryptPrivateKey(res.locals.wallet.privateKey, password);
    })
    .then((encryptedPrivateKey) => {
      if (!encryptedPrivateKey) throw new StatusError('Wrong Input', 422);
      wallet.encryptedPrivateKey = encryptedPrivateKey;
      return encryptedWalletObject(wallet);
    })
    .then((encryptedWallet) =>
      res.locals.userAccount.update({ ...encryptedWallet })
    )
    .then(() => next())
    .catch((err) => next(err));
};

// get a wallet using walletId and password
exports.retrieveWallet = async (req, res, next) => {
  const {
    user: { walletId },
    body: { password },
  } = req;

  return UserAccount.findById(walletId)
    .then((wallet) => walletObject(wallet))
    .then((wallet) => decryptPrivateKey(wallet, password))
    .then((data) => {
      return res.status(200).send({
        message: 'Wallet successfully sent',
        walletId,
        account: data,
      });
    })
    .catch((err) => {
      if (!(err instanceof StatusError))
        return next(new StatusError("Couldn't decrypt wallet", 422));
      return next(err);
    });
};

exports.deleteWallet = (req, res, next) => {
  const { walletId } = req.user;

  return UserAccount.findById(walletId)
    .then((wallet) => wallet.destroy())
    .then(() => {
      res.status(200).send({
        message: 'Wallet successfully deleted',
      });
    })
    .catch((err) => next(err));
};
