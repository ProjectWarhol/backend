const { removeTemporaryFile } = require('../util/removeTemporaryFile');
const { getContract, getSignedContract } = require('../util/bcProvider');

// Mint NFT
exports.mintNft = async (req, res) => {
  try {
    await getSignedContract().safeMint(
      req.body.ownerAddress,
      req.body.metadataUrl
    );
    res.status(200).send({
      message: 'Successfully minted NFT',
    });
  } catch (e) {
    res.status(400).send(e.body);
  }
  removeTemporaryFile(req.body.filePath);
};

// Get tokens owned by account
exports.getTokenIds = async (req, res) => {
  try {
    const result = await getContract().getTokens(req.params.address);
    // eslint-disable-next-line no-underscore-dangle
    const intTokens = result.map((element) => parseInt(element._hex, 16));
    res.status(200).send({
      tokenIds: intTokens,
    });
  } catch (e) {
    res.status(400).send({
      error: e.reason,
    });
  }
};
