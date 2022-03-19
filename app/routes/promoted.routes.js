const express = require('express');

const router = express.Router();
const promoting = require('../controllers/promoting.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get user promoters
router.get('/:promotedId', isLoggedIn, promoting.userIsPromoted);

module.exports = router;
