const fs = require('fs');
const { ethers } = require("ethers");

let provider;
let contract;
const { abi } = JSON.parse(fs.readFileSync('app/blockchain/build/contracts/PostNftMinting.json').toString());
if (process.env.NODE_ENV === 'development') {
  provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
  contract = new ethers.Contract('0x14D52Ed582f07E739856958D23aa4d795c6351b1', abi, provider);
} else if (process.env.NODE_ENV === 'staging') {
  const { ALCHEMY_STAGING_ID, CONTRACT_STAGING_ADDRESS } = process.env
  provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_STAGING_ID}`);
  contract = new ethers.Contract(CONTRACT_STAGING_ADDRESS, abi, provider);
} else if (process.env.NODE_ENV === 'production') {
  const { ALCHEMY_LIVE_ID, CONTRACT_LIVE_ADDRESS } = process.env
  provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_LIVE_ID}`)
  contract = new ethers.Contract(CONTRACT_LIVE_ADDRESS, abi, provider);
}
console.log(process.env)
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
    const tx = await contractWithSigner.safeMint(req.body.ownerAddress, req.body.metadataUrl)
    console.log(tx)
    res.status(200).send({
      message: 'Successfully minted NFT'
    });
  } catch (e) {
    res.status(400).send(e.body);
  }
  removeTemporaryFile(req.body.filePath);
};

// Get tokens owned by account
exports.getTokens = async (req, res) => {
  try {
    const result = await contract.getTokens(req.params.address)
    // eslint-disable-next-line no-underscore-dangle
    const intTokens = result.map(element => parseInt(element._hex, 16));
    res.status(200).send({
      tokens: intTokens,
    });
  } catch (e) {
    console.error(e)
  }
};
