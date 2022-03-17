const express = require('express');

const router = express.Router();
const {
  storePrivateKey,
  createWallet,
  deleteWallet,
} = require('../controllers/wallet.controller');
const { userHasNotWallet } = require('../middlewares/verification.middleware');

// Post Wallet request
router.post('/createWallet', userHasNotWallet, createWallet);

// Post PrivateKey
router.post('/:id', storePrivateKey);

router.delete('/:id', deleteWallet);

module.exports = router;
