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
  describe('deployment', async()=> {
    it('deploys successfully', async() => {
      contract = await NftMinting.deployed()
      const {address} = contract
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })
})