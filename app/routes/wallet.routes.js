const express = require('express');

const router = express.Router();
const {
  storePrivateKey,
  createWallet,
} = require('../controllers/wallet.controller');
const {
  validateWalletPosession,
} = require('../middlewares/verification.middleware');

// Post Wallet request
router.post('/createWallet', validateWalletPosession, createWallet);

// Post PrivateKey
router.post('/:id', storePrivateKey);

module.exports = router;
