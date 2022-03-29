const express = require('express');

const router = express.Router();
const nftVote = require('../controllers/nftVote.controller');
// const {
//   checkUserIdentity,
// } = require('../middlewares/authentication.middleware');
// const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Vote on NFT content
router.post('/:id', nftVote.voteNFT);

module.exports = router;
