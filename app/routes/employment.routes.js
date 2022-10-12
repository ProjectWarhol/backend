const express = require('express');

const router = express.Router();
const employment = require('../controllers/employment.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Fetch employees of q company
router.get('/', isLoggedIn, checkUserIdentity, employment.retrieveEmployees);

// Create employment
router.post('/', isLoggedIn, checkUserIdentity, employment.createEmployment);

// Delete Comment
router.delete('/', isLoggedIn, checkUserIdentity, employment.deleteEmployment);

// Patch Comment
router.patch(
  '/:id',
  isLoggedIn,
  checkUserIdentity,
  employment.updateEmployment
);

module.exports = router;
