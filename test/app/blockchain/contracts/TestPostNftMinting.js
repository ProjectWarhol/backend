const { assert } = require('chai');
const Web3 = require('web3');
const fs = require('fs');

/* eslint-disable prefer-destructuring */
const PostNftMinting = artifacts.require('PostNftMinting');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const abi = JSON.parse(
  fs
    .readFileSync('app/blockchain/build/contracts/PostNftMinting.json')
    .toString()
).abi;

contract('PostNftMinting', (accounts) => {
  const URI =
    'https://gist.githubusercontent.com/mrcgrhrdt/05dbcb0feaa64ba287977b9065395a52/raw/7b6e63d6fb5444902ac7710f8df16355066a62da/example-metadata.json';
  const ETH_DIVIDER = 1000000000000000000;
  let instance;
  let web3Instance;
  let acc0;
  let acc1;
  let tokenCounter = -1;

  before(async () => {
    instance = await PostNftMinting.deployed();
    web3Instance = new web3.eth.Contract(abi, instance.address);
  });

  beforeEach(async () => {
    acc0 = accounts[0];
    acc1 = accounts[1];
  });

  it('Minting should create token on chain', async () => {
    const tx = await instance.safeMint(acc0, URI)

    assert.isTrue(
      tx.receipt.status,
      'Token should be created'
    );
    
    tokenCounter += 1;
  });

  it('Minting should fail due to invalid address', async () => {
    try {
      await instance.safeMint('0xlakj678sfg', URI);
    } catch (e) {
      assert.strictEqual(
        e.code,
        'INVALID_ARGUMENT',
        'Receiver address is not valid'
      );
    }
  });

  it('URI of token is correct', async () => {
    await instance.safeMint(acc0, URI);
    tokenCounter += 1;
    assert.strictEqual(
      await instance.tokenURI(tokenCounter),
      URI,
      'The URI should be correct'
    );
  });

  it('Owner of token should be receiver', async () => {
    await instance.safeMint(acc1, URI);
    tokenCounter += 1;
    assert.strictEqual(
      await instance.ownerOf(tokenCounter),
      acc1,
      'Owner of token should be receiver'
    );
  });

  it('Token should be in receivers wallet', async () => {
    const balance = await instance.balanceOf(acc0);
    const amountTokensBefore = balance.words[0];

    await instance.safeMint(acc0, URI);
    tokenCounter += 1;

    const newBalance = await instance.balanceOf(acc0);
    const amountTokensAfter = newBalance.words[0];
    assert.isAbove(
      amountTokensAfter,
      amountTokensBefore,
      'Amount of tokens should be higher than before minting'
    );
  });

  it('ETH should be deducted from senders wallet', async () => {
    const senderBalance = (await web3.eth.getBalance(acc0)) / ETH_DIVIDER;

    await instance.safeMint(acc1, URI);
    tokenCounter += 1;

    const newSenderBalance = (await web3.eth.getBalance(acc0)) / ETH_DIVIDER;
    assert.isBelow(
      newSenderBalance,
      senderBalance,
      'The senders ETH should be lower than before'
    );
  });

  it('If sender and receiver are different wallets, receivers ETH should be untouched', async () => {
    const receiverBalance = (await web3.eth.getBalance(acc1)) / ETH_DIVIDER;

    await instance.safeMint(acc1, URI);
    tokenCounter += 1;

    const newReceiverBalance = (await web3.eth.getBalance(acc1)) / ETH_DIVIDER;
    assert.strictEqual(
      newReceiverBalance,
      receiverBalance,
      'The receiver ETH should be untouched'
    );
  });

  it('Transfer of token should be successful', async () => {
    await instance.safeMint(acc0, URI);
    tokenCounter += 1;
    const prevOwner = await instance.ownerOf(tokenCounter);

    await instance.tokenTransferTo(acc1, tokenCounter);
    const newOwner = await instance.ownerOf(tokenCounter);

    assert.notStrictEqual(prevOwner, newOwner, 'The owner should be different');
  });

  it('Transfer of token should fail due to wrong ownership', async () => {
    await instance.safeMint(acc1, URI);
    tokenCounter += 1;

    try {
      await instance.tokenTransferTo(acc0, tokenCounter);
    } catch (e) {
      assert.strictEqual(
        e.reason,
        'ERC721: transfer caller is not owner nor approved',
        'Caller is not the owner of token'
      );
    }
  });

  it('Transfer of token should fail due to non-existient token', async () => {
    await instance.safeMint(acc1, URI);
    tokenCounter += 1;

    try {
      await instance.tokenTransferTo(acc0, tokenCounter + 1);
    } catch (e) {
      assert.strictEqual(
        e.reason,
        'ERC721: operator query for nonexistent token',
        'Token does not exist'
      );
    }
  });

  it('Transfer of token should fail due to receiver address is not valid', async () => {
    await instance.safeMint(acc1, URI);
    tokenCounter += 1;

    try {
      await instance.tokenTransferTo('0xlsdhkshhgjk', tokenCounter);
    } catch (e) {
      assert.strictEqual(
        e.code,
        'INVALID_ARGUMENT',
        'Receover address is not valid'
      );
    }
  });

  it('Deposit of Wei should be successful', async () => {
    const tx = await web3Instance.methods
      .transferTo(acc1, 500000000000000000n)
      .send({
        from: acc0,
        value: 500000000000000000,
      });

    assert.isTrue(tx.status, 'Transaction is successful');
  });

  it('Wei is deposited in smart contract', async () => {
    const depositedPayments = await instance.payments(acc1);

    assert.equal(
      depositedPayments,
      500000000000000000,
      'Amount is not correct'
    );
  });

  it('Deposit of Wei should fails due to different values', async () => {
    try {
      await web3Instance.methods.transferTo(acc1, 500000000000000000n).send({
        from: acc0,
        value: 600000000000000000,
      });
    } catch (e) {
      assert.equal(
        Object.values(e.data)[0].reason,
        'Sent value and price are NOT the same.',
        'Sent value and price should be the same.'
      );
    }
  });

  it('Wei is withdrawn from smart contract', async () => {
    const tx = await instance.withdrawPayments(acc1);

    assert.isTrue(
      tx.receipt.status,
      'Amount is not correct'
    );
  });

  it('No more Wei is deposited in smart contract', async () => {
    const depositedPayments = await instance.payments(acc1);

    assert.equal(
      depositedPayments,
      0,
      'Amount is not correct'
    );
  });
});
