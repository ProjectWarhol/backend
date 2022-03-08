const express = require('express');

const router = express.Router();
const wallet = require('../controllers/wallet.controller');

// Post Wallet request
router.post('/createWallet', wallet.createWallet);

module.exports = router;
