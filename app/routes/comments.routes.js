const express = require('express');

const router = express.Router();
const comment = require('../controllers/comment.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch comments on a picture
router.get('/:nftId', isLoggedIn, comment.retrieveComments);

// Create comment on a picture
router.post('/:nftId', isLoggedIn, comment.createComment);

// Delete Comment
router.delete('/:commentId', isLoggedIn, comment.deleteComment);

// Patch Comment
router.patch('/:commentId', isLoggedIn, comment.updateComment);

module.exports = router;
