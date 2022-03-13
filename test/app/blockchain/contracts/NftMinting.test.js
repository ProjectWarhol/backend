// eslint-disable-next-line
const NftMinting = artifacts.require('./NftMinting');
/* eslint-disable no-undef */
// third-party
const { assert } = require('chai');

require('chai').use(require('chai-as-promised')).should();

contract('NftMinting', () => {
  let contract;
  before(async () => {
    contract = await NftMinting.deployed();
  });
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const { address } = contract;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it('has a name', async () => {
      const name = await contract.name();
      assert.equal(name, 'WarholToken');
    });
    it('has a symbol', async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'WT');
    });
    it('safe minting', async () => {
      const result = await contract.safeMint(
        '0x461900a55740465030A64E0dCd47D9d650295400',
        'https://storage.googleapis.com/opensea-prod.appspot.com/creature/1.png'
      );
      const tokenCounter = await contract.tokenCounter();
      const event = result.logs[0].args;
      // SUCCESS
      assert.equal(tokenCounter, 1);
      assert.equal(event.tokenId.toNumber(), 0, 'id is correct');
      assert.equal(
        event.from,
        '0x0000000000000000000000000000000000000000',
        'from is correct'
      );
      assert.equal(
        event.to,
        '0x461900a55740465030A64E0dCd47D9d650295400',
        'to is correct'
      );
    });
  });
});
