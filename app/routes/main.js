const express = require('express');

const router = express.Router();

const userRoutes = require('./user.routes');
const promotingRoutes = require('./promoting.routes');
const promotedRoutes = require('./promoted.routes');
const walletRoutes = require('./wallet.routes');
const commentsRoutes = require('./comments.routes');
const nftVoteRoutes = require('./nft.vote.routes');
const companyRoutes = require('./company.routes');
const contentRoutes = require('./content.routes');

// this file acts as the main router for all incoming requests
router.get('/', (_req, res) => {
  res.send('Warhol');
});

router.post('/csp-reports', (req, res) => {
  console.error(req.body);
  res.status(204).end();
});

router.use('/users', userRoutes);
router.use('/promoting', promotingRoutes);
router.use('/promoted', promotedRoutes);
router.use('/wallet', walletRoutes);
router.use('/comments', commentsRoutes);
router.use('/vote', nftVoteRoutes);
router.use('/company', companyRoutes);
router.use('/content', contentRoutes);

module.exports = router;
