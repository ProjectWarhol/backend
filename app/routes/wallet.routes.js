const express = require('express');

const router = express.Router();
const {
  retrieveWallet,
  deleteWallet,
} = require('../controllers/wallet.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get wallet request
router.get('/', isLoggedIn, retrieveWallet);

// Delete wallet request
router.delete('/', isLoggedIn, deleteWallet);

module.exports = router;
