const Web3 = require('web3');
const bip39 = require('bip39');

const web3 = new Web3();

const generateSeedPhrase = () => bip39.generateMnemonic();
exports.generateSeedPhrase = generateSeedPhrase;

exports.createCustodialWallet = () => {
  const seedPhrase = generateSeedPhrase();
  const wallet = web3.eth.accounts.create();

  return Promise.all([wallet, seedPhrase]);
};

exports.storeCustodialWallet = (privateKey, password) =>
  web3.eth.accounts.encrypt(privateKey, password);

exports.decryptPrivateKey = async (encryptedPrivateKey, password) => {
  try {
    const privateKey = await web3.eth.accounts.decrypt(
      encryptedPrivateKey,
      password
    );
    return privateKey;
  } catch (err) {
    return err;
  }
};
