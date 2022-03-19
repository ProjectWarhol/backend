const Web3 = require('web3');
const bip39 = require('bip39');

const web3 = new Web3();

exports.generateSeedPhrase = () => {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
};

exports.createCustodialWallet = () => {
  const wallet = web3.eth.accounts.create();
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
    // eslint-disable-next-line no-console
    console.log('Error has occurred:Being passed wrong args');
  }
  return undefined;
};

exports.decryptPrivateKey = (encryptedPrivateKey, password) => {
  try {
    const privateKey = web3.eth.accounts.decrypt(encryptedPrivateKey, password);
    return privateKey;
  } catch (err) {
    return err;
  }
};
