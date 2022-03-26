const bcrypt = require('bcrypt');
const { getUserPasswordHash } = require('../service/user');

exports.hashMnumonic = async (req, res, walletSeedPhrase, password) => {
  const passwordHash = await getUserPasswordHash(req, res, password);
  const mnumonicHash = await bcrypt.hash(walletSeedPhrase, passwordHash);
  return mnumonicHash;
};
