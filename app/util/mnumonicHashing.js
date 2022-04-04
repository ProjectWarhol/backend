const bcrypt = require('bcrypt');
const { getUserPasswordHash } = require('../service/user');

exports.hashMnemonic = async (id, res, walletSeedPhrase, password) => {
  const passwordHash = await getUserPasswordHash(id, res, password);
  const mnemonicHash = await bcrypt.hash(walletSeedPhrase, passwordHash);
  return mnemonicHash;
};
