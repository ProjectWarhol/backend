const fs = require('fs');
const Web3 = require('web3');

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
  console.log(req.body)
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
  const { abi } = JSON.parse(fs.readFileSync('app/blockchain/build/contracts/PostNftMinting.json').toString());

  const accounts = await web3.eth.getAccounts();
  const postNftMintingContract = new web3.eth.Contract(
    abi,
    '0x7f57643B07179086C316aCB6Dec57013D8152514'
  );

  const tokenId = await postNftMintingContract.methods.safeMint(accounts[3], req.body.metadataUrl).call()
  console.log(tokenId)
  console.log(await postNftMintingContract.methods.tokenURI(0).call())
  res.status(200).send({
    message: 'Successfully minted NFT',
    tokenId,
  });
  removeTemporaryFile(req.body.filePath);
};
