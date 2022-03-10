// eslint-disable-next-line
const NftMinting = artifacts.require('./NftMinting')
/* eslint-disable no-undef */
// third-party
const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NftMinting', ()=> {
  let contract
  before(async()=> {
    contract = await NftMinting.deployed()
  })
  describe('deployment', async()=> {
    it('deploys successfully', async() => {
      const {address} = contract
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    it('has a name', async()=> {
      const name = await contract.name()
      assert.equal(name, 'WarholToken')
    })
    it('has a symbol', async()=> {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'WT')
    })
  })
})