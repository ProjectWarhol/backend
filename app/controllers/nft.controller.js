const fs = require('fs');

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
  res.status(200).send({
    message: 'Successfully minted NFT',
  });
  removeTemporaryFile(req.body.filePath);
};
