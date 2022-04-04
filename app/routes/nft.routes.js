const express = require('express');

const router = express.Router();
// const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { uploadNft } = require('../middlewares/nft.middleware');
const { mintNft, getTokens } = require('../controllers/nft.controller');

// Mint NFT
router.post('/mint', uploadNft, mintNft);
router.get('/tokens/:address', getTokens);

module.exports = router;
