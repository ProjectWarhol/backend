const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const user = require('../controllers/user.controller');
const session = require('../controllers/session.controller');
const mailer = require('../controllers/mailer.controller');

const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Post login request
router.post('/login', check('email').isEmail(), session.login);

// Post logout request
router.post('/logout', isLoggedIn, session.logout);

// Validate session cookie
router.get('/session', isLoggedIn, session.validateSession);

// Get User object
router.get('/:userId', isLoggedIn, user.retrieveOne);

// Update a User with id
router.patch('/:id', isLoggedIn, user.updateOne);

// Set resetPassword attributes & send resetPasswordMail
router.post(
  '/resetPassword',
  user.setResetToken,
  mailer.sendResetPasswordInstructions
);

// update User password & login
router.post('/updatePassword/:token', user.updatePassword);

module.exports = router;
