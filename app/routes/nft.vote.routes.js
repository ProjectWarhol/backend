const express = require('express');

const router = express.Router();
const nftVote = require('../controllers/nft.vote.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch votes on a picture
router.get('/:nftId', isLoggedIn, nftVote.retrieveNftVotes);

// Create new vote on a picture
router.post('/:nftId', isLoggedIn, nftVote.createNftVote);

// Delete vote on a picture
router.delete('/:nftId', isLoggedIn, nftVote.deleteNftVote);

// Update vote on a picture
router.patch('/:nftId', isLoggedIn, nftVote.updateNftVote);

module.exports = router;
