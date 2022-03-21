const express = require('express');

const router = express.Router();
// const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { uploadNft } = require('../middlewares/nft.middleware');
const { mintNft } = require('../controllers/nft.controller');

// Mint NFT
router.post('/mint', uploadNft, mintNft);

module.exports = router;
