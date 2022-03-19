const {
  createCustodialWallet,
  storeCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/user');
const { decryptPrivateKey } = require('../blockchain/wallet/custodial_wallet');
const { walletObject } = require('../util/walletObject');
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
  const walletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  const storedWallet = await addWalletToDatabase(walletPublicKey, res, next);
  const userObject = await updateUserWalletId(storedWallet, id, res, next);

  res.status(200).send({
    message: 'Wallet successfully created',
    walletId: userObject.walletId,
    wallet: walletInformation,
  });
};

// store and encrypt privateKey with private/public key and password
exports.storePrivateKey = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  const wallet = {
    address: req.body.address,
    privateKey: req.body.privateKey,
    index: req.body.index,
  };

  const encryptedPrivateKey = await storeCustodialWallet(wallet, password);
  if (!encryptedPrivateKey) {
    next(defaultWrongInputHandler(res, 'wallet input'));
  }

  const encryptedData = changeObjectToData(encryptedPrivateKey);
  await updateWallet(encryptedData, id, res, next);

  res.status(200).send({
    message: 'Private key successfully stored',
  });
};

// get a wallet using walletId and password
exports.retrieveWallet = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  const userAccount = await findWalletById(id, res, next);
  const encryptedAccount = walletObject(userAccount);
  const privateKey = await decryptPrivateKey(encryptedAccount, password);

  res.status(200).send({
    message: 'wallet successfully sent',
    walletId: userAccount.id,
    publicKey: userAccount.publicKey,
    privateKey,
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
