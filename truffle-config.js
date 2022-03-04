// eslint-disable-next-line
require('dotenv').config()
const { ALCHEMY_DEV_ID, ALCHEMY_STAGING_ID, MNENOMIC } = process.env
const POLYGON_TESTNET = 'https://polygon-mumbai.g.alchemy.com/v2/'
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  license: 'MIT',
  networks: {
    development: {
     host: '127.0.0.1',
     port: 9545,
     network_id: '*',
    },
    onlineDevelopment: {
      provider: () => new HDWalletProvider(MNENOMIC, POLYGON_TESTNET + ALCHEMY_DEV_ID),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    staging: {
      provider: () => new HDWalletProvider(MNENOMIC, POLYGON_TESTNET + ALCHEMY_STAGING_ID),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.8.12',
    }
  }
}
