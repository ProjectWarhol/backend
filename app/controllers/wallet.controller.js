const bcrypt = require('bcrypt');
const Web3 = require('web3');
const {
  createCustodialWallet,
  // storeCustodialWallet,
} = require('./custodial_wallet');
const { updateUserWalletId } = require('../service/user');
const { decryptPrivateKey } = require('./custodial_wallet');
const { walletObject } = require('../util/walletObject');
const { encryptedWalletObject } = require('../util/encryptedWalletObject');
const {
  // addWalletToDatabase,
  // updateWallet,
  findWalletById,
  deleteWallet,
} = require('../service/user.account');
const db = require('../models');

const { UserAccount } = db;
const web3 = new Web3();

// create a wallet with private/public keys
exports.createWallet = (req, res, next) => {
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
      return web3.eth.accounts.encrypt(res.locals.wallet.privateKey, password);
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
exports.retrieveWallet = async (req, res) => {
  const {
    body: { password },
    params: { id },
  } = req;

  const userAccount = await findWalletById(id, res);
  const encryptedAccount = walletObject(userAccount);
  const account = await decryptPrivateKey(encryptedAccount, password);

  res.status(200).send({
    message: 'wallet successfully sent',
    walletId: userAccount.id,
    account,
  });
};

// delete wallet by id
exports.deleteWallet = async (req, res, next) => {
  const walletId = req.params.id;
  const { id } = req.body;
  const deleteObject = { dataValues: '' };

  await deleteWallet(walletId, res, next);
  await updateUserWalletId(deleteObject, id, res, next);

  res.status(200).send({
    message: 'wallet successfully deleted',
  });
};
