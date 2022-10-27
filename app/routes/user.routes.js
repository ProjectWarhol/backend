const express = require('express');
const passport = require('passport');

const router = express.Router();
const user = require('../controllers/user.controller');
const session = require('../controllers/session.controller');
const mailer = require('../controllers/mailer.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');
const { checkEmail } = require('../middlewares/validation.middleware');
const {
  createWallet,
  storePrivateKey,
} = require('../controllers/wallet.controller');

// Post login request
router.post('/login', passport.authenticate('local'), session.login);

// Post logout request
router.post('/logout', isLoggedIn, session.logout);

// Validate session cookie
router.get('/session', session.validateSession);

// Get User object
router.get('/:userName', isLoggedIn, user.retrieveOne);

// patch User Password
router.patch('/updatePassword', isLoggedIn, user.updatePassword);

// Update a User with id
router.patch('/', isLoggedIn, user.updateOne);

// Set resetPassword attributes & send resetPasswordMail
router.post(
  '/resetPassword',
  user.setResetToken,
  mailer.sendResetPasswordInstructions
);

// update User password & login
router.post('/updatePassword/:token', user.replacePassword);

// express signup
router.post(
  '/express',
  checkEmail,
  user.expressSignup,
  createWallet,
  storePrivateKey,
  passport.authenticate('local'),
  session.expressValidationResponse
);

module.exports = router;
