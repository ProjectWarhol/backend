const express = require('express');

const router = express.Router();

const userRoutes = require('./user.routes');
const promotingRoutes = require('./promoting.routes');
const promotedRoutes = require('./promoted.routes');
const walletRoutes = require('./wallet.routes');
const commentsRoutes = require('./comments.routes');
const nftRoutes = require('./nft.routes');

// this file acts as the main router for all incoming requests
router.get('/', (req, res) => {
  res.send('Warhol');
});

router.use('/users', userRoutes);
router.use('/promoting', promotingRoutes);
router.use('/promoted', promotedRoutes);
router.use('/wallet', walletRoutes);
router.use('/comments', commentsRoutes);
router.use('/nft', nftRoutes);

module.exports = router;
