const {
  createCustodialWallet,
  storeCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/user');
const { changeObjectToData } = require('../util/privateKeyObject');
const {
  addWalletToDatabase,
  updateWallet,
  deleteWallet,
} = require('../service/user.account');

// create a wallet with private/public keys
exports.createWallet = async (req, res, next) => {
  const { id } = req.body;

  const wallet = await createCustodialWallet();
  const walletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  const storedWallet = await addWalletToDatabase(walletPublicKey, next);
  const userObject = await updateUserWalletId(next, storedWallet, id);

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
  const encryptedData = changeObjectToData(encryptedPrivateKey);
  const rowsUpdated = await updateWallet(encryptedData, next, id);

  if (rowsUpdated) {
    res.status(200).send({
      message: 'Private key successfully stored',
    });
  } else {
    const error = new Error('wallet not found');
    error.status = 404;
    next(error);
  }
};

exports.deleteWallet = async (req, res, next) => {
  const walletId = req.params.id;
  const { id } = req.body;
  const deleteObject = { dataValues: '' };

  await deleteWallet(walletId, res, next);
  await updateUserWalletId(next, deleteObject, id);

  res.status(200).send({
    message: 'wallet successfully deleted',
  });
};
