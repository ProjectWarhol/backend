/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { assert } = require('chai');
const Web3 = require('web3');
const fs = require('fs');
require('chai').use(require('chai-as-promised')).should();

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
    it('set royalties', async () => {
      // SUCCESS
      const result = await instance.setRoyalties(
        '0xbB6a504db322427139722e68ae9b2F5fa2c36381',
        10
      );
      const event = result.logs[0].args;
      const { account } = event;
      const { shares } = event;
      assert.equal(account, '0xbB6a504db322427139722e68ae9b2F5fa2c36381');
      assert.equal(shares, 10);
      // FAILURE
      await instance.setRoyalties(
        '0xbB6a504db322427139722e68ae9b2F5fa2c36381',
        -10
      ).should.be.rejected;
      await instance.setRoyalties('', 10).should.be.rejected;
    });
  });
});
