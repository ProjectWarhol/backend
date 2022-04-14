const fs = require('fs');
const { ethers } = require('ethers');

let contract;
let contractWithSigner;

exports.setup = () => {
  let provider;
  const { abi } = JSON.parse(
    fs
      .readFileSync('app/blockchain/build/contracts/PostNftMinting.json')
      .toString()
  );
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
    contract = new ethers.Contract(
      process.env.CONTRACT_LOCAL_ADDRESS,
      abi,
      provider
    );
  } else if (process.env.NODE_ENV === 'staging') {
    const { ALCHEMY_STAGING_ID, CONTRACT_STAGING_ADDRESS } = process.env;
    provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_STAGING_ID}`
    );
    contract = new ethers.Contract(CONTRACT_STAGING_ADDRESS, abi, provider);
  } else if (process.env.NODE_ENV === 'production') {
    const { ALCHEMY_LIVE_ID, CONTRACT_LIVE_ADDRESS } = process.env;
    provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_LIVE_ID}`
    );
    contract = new ethers.Contract(CONTRACT_LIVE_ADDRESS, abi, provider);
  }
  const signer = provider.getSigner();
  contractWithSigner = contract.connect(signer);
  return { contract, contractWithSigner };
};

exports.getContract = () => contract;

exports.getSignedContract = () => contractWithSigner;
