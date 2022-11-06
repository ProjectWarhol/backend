const express = require('express');

const router = express.Router();
const content = require('../controllers/content.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get nft contents, search by company name and category
router.post('/', isLoggedIn, content.retrieveFiltered);

module.exports = router;
