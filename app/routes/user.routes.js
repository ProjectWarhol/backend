const express = require('express');

const router = express.Router();
const user = require('../controllers/user.controller');
const session = require('../controllers/session.controller');
const mailer = require('../controllers/mailer.controller');
const {
  isLoggedIn,
  checkLoginInput,
} = require('../middlewares/authorization.middleware');
const {
  createWallet,
  storePrivateKey,
} = require('../controllers/wallet.controller');
const { userHasNotWallet } = require('../middlewares/verification.middleware');

// Post login request
router.post('/login', checkLoginInput, session.login);

// Post logout request
router.post('/logout', isLoggedIn, session.logout);

// Validate session cookie
router.get('/session', session.validateSession);

// Get User object
router.get('/:userName', isLoggedIn, user.retrieveOne);

// Create User
router.post('/createUser', user.createOne);

// patch User Password
router.patch('/updatePassword', isLoggedIn, user.updatePassword);

// Update a User with id
router.patch('/:id', isLoggedIn, user.updateOne);

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
  user.expressSignup,
  userHasNotWallet,
  createWallet,
  storePrivateKey,
  session.expressValidationResponse
);

module.exports = router;
