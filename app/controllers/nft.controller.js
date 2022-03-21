const path = require('path');
const fs = require('fs');

const removeTemporaryFile = (filePath) => {
	try {
		fs.unlinkSync(filePath);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
}

// Mint NFT
exports.mintNft = async (req, res) => {
	if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

	const file = req.files.nftSource;
	const filePath = path.join(__dirname, '/tmp_nft_sources/', file.name);
	file.mv(filePath, (err) => {
		if (err) {
      return res.status(500).send(err);
    }
		res.status(200).send('NFT minted successfully')
		removeTemporaryFile(filePath);
	});
};
