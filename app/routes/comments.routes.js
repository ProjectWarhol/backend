const express = require('express');

const router = express.Router();
const comments = require('../controllers/comments.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch comments on a picture
router.get('/:id', isLoggedIn, comments.retrieveComments);

// Create comment on a picture
router.post('/:id', isLoggedIn, comments.createComment);

module.exports = router;
