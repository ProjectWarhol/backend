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
  let projectOwner;
  let instance;
  let artist;
  let seller;

  before(async () => {
    projectOwner = '0xC2F089A754fa423491c364884443fBEd76cCde05';
    instance = await SplitPayment.deployed();
    web3Instance = new web3.eth.Contract(abi, instance.address);
    artist = accounts[1];
    seller = accounts[2];
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
      const result = await instance.setRoyalties(artist, 10);
      const event = result.logs[0].args;
      const { account } = event;
      const { shares } = event;
      assert.equal(account, artist);
      assert.equal(shares, 10);
      // FAILURE
      await instance.setRoyalties(artist, -10).should.be.rejected;
      await instance.setRoyalties('', 10).should.be.rejected;
    });

    it("set seller's share", async () => {
      // SUCCESS
      const result = await instance.setSellerShare(seller);
      const event = result.logs[0].args;
      const { account } = event;
      const { shares } = event;
      assert.equal(account, seller);
      assert.equal(shares, 88); // 100 -2 -10
      // for some reasons , it shows an error
      console.log(await instance.payeeAddress(1));
    });
    it("returns project owner's address", async () => {
      const actual = await instance.payeeAddress(0);
      const expected = projectOwner;
      assert.equal(actual, expected);
    });
    it("returns project owner's share", async () => {
      const actual = await instance.getShares(projectOwner);
      assert.equal(actual, 2);
    });
  });
});
