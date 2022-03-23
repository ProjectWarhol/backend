/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { assert } = require('chai');
const Web3 = require('web3');
const fs = require('fs');

/* eslint-disable prefer-destructuring */
const SplitPayment = artifacts.require('SplitPayment');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const abi = JSON.parse(
  fs.readFileSync('app/blockchain/build/contracts/SplitPayment.json').toString()
).abi;

contract('SplitPayment', (accounts) => {
  let instance;
  let web3Instance;

  before(async () => {
    instance = await SplitPayment.deployed();
    web3Instance = new web3.eth.Contract(abi, instance.address);
  });
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const { address } = instance;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });
});
