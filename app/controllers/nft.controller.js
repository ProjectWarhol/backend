// Mint NFT
exports.mintNft = (req, res, next) => {
	res.status(200).send({
		message: 'Successfully minted NFT'
	});
};
