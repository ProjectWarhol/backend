/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-unresolved */
const { assert } = require('chai');
const Web3 = require('web3');
const fs = require('fs');
require('chai').use(require('chai-as-promised')).should();

/* eslint-disable prefer-destructuring */
const PostNftMinting = artifacts.require('PostNftMinting');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const abi = JSON.parse(
  fs
    .readFileSync('app/blockchain/build/contracts/PostNftMinting.json')
    .toString()
).abi;

contract('PostNftMinting', (accounts) => {
  const ETH_DIVIDER = 1000000000000000000;
  let instance;
  let web3Instance;
  let acc0;
  let acc1;
  let acc2;
  let acc3;
  let tokenCounter = -1;

  before(async () => {
    instance = await PostNftMinting.deployed();
    web3Instance = new web3.eth.Contract(abi, instance.address);
  });

  beforeEach(async () => {
    acc0 = accounts[0];
    acc1 = accounts[1];
    acc2 = accounts[2];
    acc3 = accounts[3];
  });

  it('Minting should create token on chain', async () => {
    const uri =
      'https://gist.githubusercontent.com/mrcgrhrdt/05dbcb0feaa64ba287977b9065395a52/raw/7b6e63d6fb5444902ac7710f8df16355066a62da/example-metadata.json';
    const tx = await instance.safeMint(acc0, uri);
    const event = tx.logs[0].args;
    // SUCCESS
    assert.isTrue(tx.receipt.status, 'Token should be created');
    assert.equal(event.to, acc0, 'to should be acc0');
    assert.notEqual(event.from, acc1, 'to should not be acc1');

    tokenCounter += 1;

    // FAILURE 'the same uri should not be minted again'
    await instance.safeMint(acc0, uri).should.be.rejected;
    await instance.safeMint(acc1, uri).should.be.rejected;
  });

  it('Minting should fail due to invalid address', async () => {
    try {
      const uri = 'https://1';
      await instance.safeMint('0xlakj678sfg', uri);
    } catch (e) {
      assert.strictEqual(
        e.code,
        'INVALID_ARGUMENT',
        'Receiver address is not valid'
      );
    }
  });

  it('URI of token is correct', async () => {
    const uri = 'https://2';
    await instance.safeMint(acc0, uri);
    tokenCounter += 1;
    assert.strictEqual(
      await instance.tokenURI(tokenCounter),
      uri,
      'The URI should be correct'
    );
  });

  it('Owner of token should be receiver', async () => {
    const uri = 'https://3';
    await instance.safeMint(acc1, uri);
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
    const uri = 'https://4';
    await instance.safeMint(acc0, uri);
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
    const uri = 'https://5';
    await instance.safeMint(acc1, uri);
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
    const uri = 'https://6';
    await instance.safeMint(acc1, uri);
    tokenCounter += 1;

    const newReceiverBalance = (await web3.eth.getBalance(acc1)) / ETH_DIVIDER;
    assert.strictEqual(
      newReceiverBalance,
      receiverBalance,
      'The receiver ETH should be untouched'
    );
  });

  it('Transfer of token should be successful', async () => {
    const uri = 'https://7';
    await instance.safeMint(acc0, uri);
    tokenCounter += 1;
    const prevOwner = await instance.ownerOf(tokenCounter);

    await instance.tokenTransferTo(acc1, tokenCounter);
    const newOwner = await instance.ownerOf(tokenCounter);

    assert.notStrictEqual(prevOwner, newOwner, 'The owner should be different');
  });

  it('Transfer of token should fail due to wrong ownership', async () => {
    const uri = 'https://8';
    await instance.safeMint(acc1, uri);
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
    const uri = 'https://9';
    await instance.safeMint(acc1, uri);
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
    const uri = 'https://10';
    await instance.safeMint(acc1, uri);
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

  it('Pay Out', async () => {
    const initialBalances = [];
    const payees = [acc1, acc2, acc3];
    const shares = [88, 10, 2];
    const afterBalances = [];
    // Before
    for (let i = 0; i < payees.length; i++) {
      const currentBalance = await web3.eth.getBalance(payees[i]);
      initialBalances.push(currentBalance); // balances before payout
      await instance.addPayee(payees[i], shares[i]);
    }
    // Payout
    await web3Instance.methods.payOut(1000000000000000000n).send({
      from: acc0,
      value: 1000000000000000000,
    });
    // After
    for (let i = 0; i < payees.length; i++) {
      const currentBalance = await web3.eth.getBalance(payees[i]);
      afterBalances.push(currentBalance); // balances after payout
    }
    // Difference between After and Before
    for (let i = 0; i < payees.length; i++) {
      const actual = afterBalances[i] - initialBalances[i];
      // loop
      assert.equal(actual, (1000000000000000000 * shares[i]) / 100);
    }
  });
});
