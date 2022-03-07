const express = require('express');

const router = express.Router();
const wallet = require('../controllers/wallet.controller');

// Post Wallet request
router.post('/:id', wallet.createWallet);

module.exports = router;
