const Web3 = require('web3');
const bip39 = require('bip39');

const web3 = new Web3();

exports.generateSeedPhrase = () => {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
};

exports.createCustodialWallet = () => {
  const wallet = web3.eth.accounts.wallet.create(1);
  const seedPhrase = exports.generateSeedPhrase();
  const data = {
    wallet,
    seedPhrase,
  };
  return data;
};

exports.storeCustodialWallet = (custodialWalletData, password) => {
  try {
    const { seedPhrase } = custodialWalletData;
    const { address, privateKey } = custodialWalletData;
    const encryptedPrivateKey = web3.eth.accounts.encrypt(privateKey, password);
    const data = {
      address,
      encryptedPrivateKey,
      seedPhrase,
    };
    return data;
  } catch (err) {
    return err;
  }
};

exports.decryptPrivateKey = (custodialWalletData, password) => {
  try {
    const privateKey = web3.eth.accounts.wallet.decrypt(
      custodialWalletData,
      password
    );
    return privateKey;
  } catch (err) {
    return err;
  }
};
