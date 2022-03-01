const express = require('express');

const router = express.Router();

const userRoutes = require('./user.routes');
const walletRoutes = require('./wallet.routes');

// this file acts as the main router for all incoming requests
router.get('/', (req, res) => {
  res.send('Warhol');
});

router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;
