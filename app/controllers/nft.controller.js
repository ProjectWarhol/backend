const fs = require('fs');
const { ethers } = require("ethers");

let provider;
let contract;
const { abi } = JSON.parse(fs.readFileSync('app/blockchain/build/contracts/PostNftMinting.json').toString());
if (process.env.NODE_ENV === 'development') {
  provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
  contract = new ethers.Contract(process.env.CONTRACT_LOCAL_ADDRESS, abi, provider);
} else if (process.env.NODE_ENV === 'staging') {
  const { ALCHEMY_STAGING_ID, CONTRACT_STAGING_ADDRESS } = process.env
  provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_STAGING_ID}`);
  contract = new ethers.Contract(CONTRACT_STAGING_ADDRESS, abi, provider);
} else if (process.env.NODE_ENV === 'production') {
  const { ALCHEMY_LIVE_ID, CONTRACT_LIVE_ADDRESS } = process.env
  provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_LIVE_ID}`)
  contract = new ethers.Contract(CONTRACT_LIVE_ADDRESS, abi, provider);
}
const signer = provider.getSigner();
const contractWithSigner = contract.connect(signer);

// Remove file from temporary folder
const removeTemporaryFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

// Mint NFT
exports.mintNft = async (req, res) => {
  try {
    await contractWithSigner.safeMint(req.body.ownerAddress, req.body.metadataUrl)
    res.status(200).send({
      message: 'Successfully minted NFT'
    });
  } catch (e) {
    res.status(400).send(e.body);
  }
  removeTemporaryFile(req.body.filePath);
};

// Get tokens owned by account
exports.getTokenIds = async (req, res) => {
  try {
    const result = await contract.getTokens(req.params.address)
    // eslint-disable-next-line no-underscore-dangle
    const intTokens = result.map(element => parseInt(element._hex, 16));
    res.status(200).send({
      tokenIds: intTokens,
    });
  } catch (e) {
    res.status(400).send({
      error: e.reason
    });
  }
};
