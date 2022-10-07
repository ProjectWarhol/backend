const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

module.exports = router;

// Create a company
router.post('/', isLoggedIn, checkUserIdentity, company.createCompany);

// Delete a company
router.delete('/', isLoggedIn, checkUserIdentity, company.deleteCompany);

// Patch a company
router.patch('/', isLoggedIn, checkUserIdentity, company.patchCompany);
