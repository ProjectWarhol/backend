const express = require('express');

const router = express.Router();
const promoting = require('../controllers/promoting.controller');
const { checkUserIdentity } = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get user promoters
router.get('/isPromoted', isLoggedIn, promoting.userIsPromoted);

// Get users promoted by user
router.get('/', isLoggedIn, promoting.userPromoting);

// Post user promotes
router.post('/:promotedId', isLoggedIn, checkUserIdentity, promoting.promotingOneUser);

// Delete user promotes
router.delete('/:promotedId', isLoggedIn, checkUserIdentity, promoting.unpromotingOneUser);

module.exports = router;
