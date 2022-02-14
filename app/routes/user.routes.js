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
// Not sure if we need to be logged in to req this route. A user profile should be accessible to non logged users
router.get('/:username', user.getUser);

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
