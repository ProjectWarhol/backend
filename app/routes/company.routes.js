const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Create a new Company
router.post('/', isLoggedIn, checkUserIdentity, company.createComment);

// Delete Comment
router.delete('/', isLoggedIn, checkUserIdentity, company.deleteComment);

// Patch Comment
router.patch('/', isLoggedIn, checkUserIdentity, company.updateComment);

module.exports = router;
