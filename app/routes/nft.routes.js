const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { uploadNft } = require('../middlewares/nft.middleware');
const { mintNft, getTokenIds } = require('../controllers/nft.controller');

// Mint NFT
router.post('/mint', isLoggedIn, uploadNft, mintNft);
router.get('/tokens/:address', isLoggedIn, getTokenIds);

module.exports = router;
