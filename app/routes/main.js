const express = require('express');

const router = express.Router();

const userRoutes = require('./user.routes');

// this file acts as the main router for all incoming requests
router.get('/', (req, res) => {
  res.send('Warhol');
});

router.use('/users', userRoutes);

module.exports = router;
