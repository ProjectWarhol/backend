const {
  createCustodialWallet,
} = require('../blockchain/wallet/custodial_wallet');
const { updateUserWalletId } = require('../service/update.user');
const { createWallet } = require('../service/user.account');

exports.createWallet = async (req, res, next) => {
  const { id } = req.body;
  const wallet = await createCustodialWallet();
  const walletPublicKey = { publicKey: wallet.wallet[0].address };
  const walletInformation = wallet.wallet[0];

  const storedWallet = await createWallet(walletPublicKey, next);
  const userObject = await updateUserWalletId(next, storedWallet, id);

  res.status(200).send({
    message: 'Wallet successfully created',
    walletId: userObject.walletId,
    wallet: walletInformation,
  });
};
