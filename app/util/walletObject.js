exports.walletObject = (account) => ({
  version: account.version,
  id: account.id,
  address: account.address,
  crypto: {
    ciphertext: account.ciphertext,
    cipherparams: { iv: account.iv },
    cipher: account.cipher,
    kdf: account.kdf,
    kdfparams: {
      dklen: account.dklen,
      salt: account.salt,
      n: account.n,
      r: account.r,
      p: account.p,
    },
    mac: account.mac,
  },
});
