const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { uploadNft, retrieveChild } = require('../middlewares/nft.middleware');
const { mintNft, getTokenIds } = require('../controllers/nft.controller');

// Mint NFT
router.post('/mint', isLoggedIn, uploadNft, mintNft);
router.get('/tokens/:address', isLoggedIn, getTokenIds);

// Receive NftChild
router.get('/:id', isLoggedIn, retrieveChild);

module.exports = router;
