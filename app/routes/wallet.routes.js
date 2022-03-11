const express = require('express');

const router = express.Router();
const wallet = require('../controllers/wallet.controller');
const {
  userHasNotWallet,
} = require('../middlewares/verification.middleware');

// Post Wallet request
router.post('/createWallet', userHasNotWallet, wallet.createWallet);

module.exports = router;
