const express = require('express');

const router = express.Router();
const comments = require('../controllers/comments.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch comments on a picture
router.get('/:id', isLoggedIn, comments.retrieveComments);

// Create comment on a picture
router.post('/:id', isLoggedIn, checkUserIdentity, comments.createComment);

// Delete Comment
router.delete('/', comments.deleteComment);

// Patch Comment
router.patch('/:id', comments.updateComment);

module.exports = router;
