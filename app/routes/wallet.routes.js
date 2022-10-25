const express = require('express');

const router = express.Router();
const {
  retrieveWallet,
  deleteWallet,
} = require('../controllers/wallet.controller');

// Get wallet request
router.get('/', retrieveWallet);

// Delete wallet request
router.delete('/', deleteWallet);

module.exports = router;
