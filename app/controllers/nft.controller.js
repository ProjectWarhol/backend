const { removeTemporaryFile } = require('../util/removeTemporaryFile');
const { getContract, getSignedContract } = require('../util/bcProvider');

const db = require('../models');

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
      error: e,
    });
  }
};

// Get Child NFTs
exports.getChildNfts = async (req, res) => {
  try {
    const result = await db.NftChild.findAll({
      where: { parentId: req.params.id }, // How do i get the parentId from the request?
      order: [['id', 'ASC']],
    });
    res.status(200).send({ result });
  } catch (e) {
    res.status(400).send({
      error: e,
    });
  }
};

// const hasChild = async (parentId) => {
//   if (!parentId) {
//     return false;
//   }
//   const client = new NFTStorage({
//     token: process.env.NFT_STORAGE_KEY,
//   });

//   try {
//     const metadata = await client.get(parentId);
//     return metadata.attributes.childId;
//   } catch (error) {
//     return false;
//   }
// }
