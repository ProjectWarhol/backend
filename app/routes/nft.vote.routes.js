const express = require('express');

const router = express.Router();
const nftVote = require('../controllers/nft.vote.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch votes on a picture
router.get('/:id', isLoggedIn, nftVote.retrieveNftVotes);

// Create new vote on a picture
router.post('/:id', isLoggedIn, checkUserIdentity, nftVote.createNftVote);

// Delete vote on a picture
router.delete('/:id', isLoggedIn, checkUserIdentity, nftVote.deleteNftVote);

// Update vote on a picture
router.patch('/:id', isLoggedIn, checkUserIdentity, nftVote.updateNftVote);

module.exports = router;
