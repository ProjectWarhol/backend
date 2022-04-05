const express = require('express');

const router = express.Router();
const {
  retrieveWallet,
  deleteWallet,
} = require('../controllers/wallet.controller');

// Get wallet request
router.get('/:id', retrieveWallet);

// Delete wallet request
router.delete('/:id', deleteWallet);

module.exports = router;
