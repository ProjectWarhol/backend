const express = require('express');
const wallet = require('../controllers/wallet.controller');

const router = express.Router();

// Post Wallet request
router.post('/:id', wallet.createWAllet);

module.exports = router;
