const express = require('express');

const router = express.Router();
const comments = require('../controllers/comments.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch comments on a picture
router.get('/:nftId', isLoggedIn, comments.retrieveComments);

// Create comment on a picture
router.post('/:nftId', isLoggedIn, comments.createComment);

// Delete Comment
router.delete('/:commentid', isLoggedIn, comments.deleteComment);

// Patch Comment
router.patch('/:commentid', isLoggedIn, comments.updateComment);

module.exports = router;
