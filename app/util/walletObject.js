exports.walletObject = (wallet) => ({
  version: wallet.version,
  id: wallet.id,
  address: wallet.address,
  crypto: {
    ciphertext: wallet.ciphertext,
    cipherparams: { iv: wallet.iv },
    cipher: wallet.cipher,
    kdf: wallet.kdf,
    kdfparams: {
      dklen: wallet.dklen,
      salt: wallet.salt,
      n: wallet.n,
      r: wallet.r,
      p: wallet.p,
    },
    mac: wallet.mac,
  },
});

exports.encryptedWalletObject = (encryptedWallet) => ({
  publicKey: encryptedWallet.address,
  version: encryptedWallet.encryptedPrivateKey.version,
  address: encryptedWallet.encryptedPrivateKey.address,
  mnemonicHash: encryptedWallet.mnemonicHash,
  ciphertext: encryptedWallet.encryptedPrivateKey.crypto.ciphertext,
  iv: encryptedWallet.encryptedPrivateKey.crypto.cipherparams.iv,
  cipher: encryptedWallet.encryptedPrivateKey.crypto.cipher,
  kdf: encryptedWallet.encryptedPrivateKey.crypto.kdf,
  mac: encryptedWallet.encryptedPrivateKey.crypto.mac,
  dklen: encryptedWallet.encryptedPrivateKey.crypto.kdfparams.dklen,
  salt: encryptedWallet.encryptedPrivateKey.crypto.kdfparams.salt,
  n: encryptedWallet.encryptedPrivateKey.crypto.kdfparams.n,
  r: encryptedWallet.encryptedPrivateKey.crypto.kdfparams.r,
  p: encryptedWallet.encryptedPrivateKey.crypto.kdfparams.p,
});
