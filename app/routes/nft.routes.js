const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { uploadNft } = require('../middlewares/nft.middleware');
const {
  mintNft,
  getTokenIds,
  retrieveNFTs,
} = require('../controllers/nft.controller');

// Mint NFT
router.post('/mint', isLoggedIn, uploadNft, mintNft);
router.get('/tokens/:address', isLoggedIn, getTokenIds);

// Retrieve NFTs
router.get('/pull', isLoggedIn, retrieveNFTs);

module.exports = router;
