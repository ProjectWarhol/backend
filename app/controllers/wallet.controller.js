const {
  createCustodialWallet,
  storeCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/user');
const { decryptPrivateKey } = require('../blockchain/wallet/custodial_wallet');
const { walletObject } = require('../util/walletObject');
const { hashMnemonic } = require('../util/mnumonicHashing');
const { changeObjectToData } = require('../util/privateKeyObject');
const {
  addWalletToDatabase,
  updateWallet,
  findWalletById,
  deleteWallet,
} = require('../service/user.account');
const {
  defaultWrongInputHandler,
} = require('../middlewares/error_handlers.middleware');

// create a wallet with private/public keys
exports.createWallet = async (req, res, next) => {
  const { id } = req.body;

  const wallet = await createCustodialWallet();
  const walletPublicKey = { publicKey: wallet.wallet.address };
  const walletInformation = wallet.wallet;
  const mnemonicPhrase = wallet.seedPhrase;

  const storedWallet = await addWalletToDatabase(walletPublicKey, res, next);
  const userObject = await updateUserWalletId(storedWallet, id, res, next);
  console.log('WALLET');
  req.body.walletInformation = walletInformation;
  req.body.mnemonicPhrase = mnemonicPhrase;
  req.body.walletId = userObject.walletId;
  req.body.id = userObject.id;

  next();
};

// store and encrypt privateKey with private/public key and password
exports.storePrivateKey = async (req, res, next) => {
  const { password, id, walletId } = req.body;
  const wallet = {
    address: req.body.walletInformation.address,
    privateKey: req.body.walletInformation.privateKey,
    index: req.body.walletInformation.index,
    mnemonicPhrase: req.body.mnemonicPhrase,
  };

  const mnemonicHash = await hashMnemonic(
    id,
    res,
    wallet.mnemonicPhrase,
    password
  );

  const encryptedPrivateKey = await storeCustodialWallet(wallet, password);
  if (!encryptedPrivateKey) {
    defaultWrongInputHandler(res, 'wallet input');
  }

  const encryptedData = changeObjectToData(encryptedPrivateKey, mnemonicHash);
  await updateWallet(encryptedData, walletId, res, next);

  next();
};

// get a wallet using walletId and password
exports.retrieveWallet = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

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
