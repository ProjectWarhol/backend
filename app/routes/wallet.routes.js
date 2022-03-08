const express = require('express');

const router = express.Router();
const wallet = require('../controllers/wallet.controller');
const {
  validateWalletPosession,
} = require('../middlewares/verification.middleware');

// Post Wallet request
router.post('/createWallet', validateWalletPosession, wallet.createWallet);

module.exports = router;
