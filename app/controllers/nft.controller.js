/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { removeTemporaryFile } = require('../util/removeTemporaryFile');
const { getContract, getSignedContract } = require('../util/bcProvider');

const db = require('../models');

const { NftContent, NftChild } = db;

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

// Retrieve NFTs
exports.retrieveNFTs = async (req, res) => {
  const displayedNfts = [];
  try {
    const nftsParent = await NftContent.findAll({
      limit: 3,
      order: [['upvotes', 'DESC']],
    });
    displayedNfts.push(nftsParent);

    // Filter out Nfts with children
    const nftsWithChild = nftsParent.filter(
      (nft) => nft.dataValues.hasChild === true
    );
    const parentIds = [];
    for (const obj of nftsWithChild) {
      const parentId = Object.values(obj.dataValues)[0];
      parentIds.push(parentId);
    }

    const nftsChildren = await NftChild.findAll({
      where: { parentId: parentIds.map((id) => id.toString()) },
      limit: 3,
    });

    nftsChildren.forEach((child) => {
      const nft = nftsParent.find((parent) => parent.id === child.parentId);
      if (nft.dataValues.children == null) {
        nft.dataValues.children = [];
        nft.dataValues.children.push(child);
      } else {
        nft.dataValues.children.push(child);
      }
    });

    res.status(200).send({
      nfts: nftsParent,
    });
  } catch (e) {
    res.status(400).send({
      error: e,
    });
  }
};
