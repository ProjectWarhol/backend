const bcrypt = require('bcrypt');
const { getUserPasswordHash } = require('../service/user');

exports.hashMnemonic = async (req, res, walletSeedPhrase, password) => {
  const passwordHash = await getUserPasswordHash(req, res, password);
  const mnemonicHash = await bcrypt.hash(walletSeedPhrase, passwordHash);
  return mnemonicHash;
};
