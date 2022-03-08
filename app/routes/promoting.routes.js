const express = require('express');

const router = express.Router();
const promoting = require('../controllers/promoting.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get user promoters
router.get('/isPromoted', isLoggedIn, promoting.userIsPromoted);

// Get users promoted by user
router.get('/', isLoggedIn, promoting.userPromoting);

// Post user promotes
router.post('/:userId', isLoggedIn, promoting.promotingOneUser);

// Delete user promotes
router.delete('/:userId', isLoggedIn, promoting.unpromotingOneUser);

module.exports = router;
