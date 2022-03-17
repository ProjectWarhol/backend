const express = require('express');

const router = express.Router();
const promoting = require('../controllers/promoting.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get users promoted by user
router.get('/:userId', isLoggedIn, promoting.userPromoting);

// Post user promotes
router.post('/:promotedId', isLoggedIn, promoting.promotingOneUser);

// Delete user promotes
router.delete('/:promotedId', isLoggedIn, promoting.unpromotingOneUser);

module.exports = router;
