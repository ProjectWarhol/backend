const express = require('express');

const router = express.Router();
const comments = require('../controllers/comments.controller');
const { checkUserIdentity } = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch comments on a picture
router.get('/', isLoggedIn, comments.retrieveComments);

// Create comment on a picture
router.post('/', isLoggedIn, checkUserIdentity, comments.createComment);

module.exports = router;
