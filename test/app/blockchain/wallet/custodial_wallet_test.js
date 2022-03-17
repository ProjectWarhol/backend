/* eslint-disable no-undef */
// third-party
const { assert } = require('chai');

// local
const {
  generateSeedPhrase,
  createCustodialWallet,
  storeCustodialWallet,
} = require('../../../../app/blockchain/wallet/custodial_wallet');

// Global
let custodialWalletData = {
  address: '0x0d2995d304fe3E28E12827001E3fE7c916343221',
  privateKey:
    '0x1940082155f05c0e5bfe0d6fdc2fe28d9a2b4f94101d5fc83f2b03e8b77dae7b',
  seedPhrase:
    'blouse diet retreat cry sun badge return decide ski stick glory lazy',
};
let password = 'test';

describe('generateSeedPhrase', () => {
  it('should return 12 words', () => {
    const phrases = generateSeedPhrase();
    const actual = phrases.split(' ');
    assert.lengthOf(actual, 12);
  });
});

describe('createCustodialWallet', () => {
  const actual = createCustodialWallet();
  it('should return wallet and seedPhrase as keys', () => {
    const expected = {
      wallet: 'new wallet',
      seedPhrase: 'new seed phrase',
    };
    assert.hasAllKeys(actual, expected);
  });
  it('should return wallet and seedPhrase as keys', () => {
    const notExpected = {
      random_one: 'random_one',
      random_two: 'random_two',
    };
    assert.doesNotHaveAnyKeys(actual, notExpected);
  });
  // create multiple accounts
  it('should generate different addresses', () => {
    const { wallet: walletOne } = createCustodialWallet();
    const { wallet: walletTwo } = createCustodialWallet();
    assert.notEqual(walletOne.address, walletTwo.address);
  });
});

describe('storeCustodialWallet', () => {
  let actual = storeCustodialWallet(custodialWalletData, password);

  it('should return three keys', () => {
    const expected = {
      address: 'address',
      encryptedPrivateKey: 'encryptedPrivateKey',
      seedPhrase: 'seedPhrase',
    };
    assert.hasAllKeys(actual, expected);
  });
  it('should return the correct address', () => {
    const expected = custodialWalletData.address;
    assert.equal(actual.address, expected);
  });
  it('should encrypt the private key', () => {
    const notExpected = custodialWalletData.privateKey;
    assert.notEqual(actual.encryptedPrivateKey, notExpected);
  });
  it('should return the correct seedPhrase', () => {
    const expected = custodialWalletData.seedPhrase;
    assert.equal(actual.seedPhrase, expected);
  });
  // Failure case
  it('should return undefined', () => {
    custodialWalletData = 'wallet';
    password = 'test';
    actual = storeCustodialWallet(custodialWalletData, password);
    assert.equal(actual, undefined);
  });
});

