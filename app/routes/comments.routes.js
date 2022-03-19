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
<<<<<<< HEAD
router.post('/', isLoggedIn, checkUserIdentity, comments.createComment);
=======
router.post('/:id', isLoggedIn, comments.createComment);
>>>>>>> main

module.exports = router;
