const express = require('express');

const router = express.Router();
const {
  retrieveWallet,
  storePrivateKey,
  createWallet,
} = require('../controllers/wallet.controller');
const {
  userHasNotWallet,
} = require('../middlewares/verification.middleware');

// Post Wallet request
router.post('/createWallet', userHasNotWallet, createWallet);

// Get wallet request
router.get('/:id', retrieveWallet);

// Post PrivateKey
router.post('/:id', storePrivateKey);

module.exports = router;
