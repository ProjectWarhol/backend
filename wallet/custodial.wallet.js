// third-party
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
  const wallet = custodialWalletData.wallet[0];
  const { seedPhrase } = custodialWalletData;
  const { address } = wallet;
  const { privateKey } = wallet;
  const encryptedPrivateKey = web3.eth.accounts.encrypt(privateKey, password);
  const data = {
    address,
    encryptedPrivateKey,
    seedPhrase,
  };
  return data;
};
