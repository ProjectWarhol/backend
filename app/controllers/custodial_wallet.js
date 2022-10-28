const Web3 = require('web3');
const bip39 = require('bip39');

const web3 = new Web3();

exports.createCustodialWallet = () => {
  const seedPhrase = bip39.generateMnemonic();
  const wallet = web3.eth.accounts.create();

  return Promise.all([wallet, seedPhrase]);
};

exports.encryptPrivateKey = (privateKey, password) =>
  web3.eth.accounts.encrypt(privateKey, password);

exports.decryptPrivateKey = (encryptedPrivateKey, password) =>
  web3.eth.accounts.decrypt(encryptedPrivateKey, password);
