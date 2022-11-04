const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
const {
  checkUserIdentity,
} = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Create a new Company
router.post('/', isLoggedIn, checkUserIdentity, company.createCompany);

// Delete Company
router.delete('/', isLoggedIn, checkUserIdentity, company.deleteCompany);

// Patch Company
router.patch('/', isLoggedIn, checkUserIdentity, company.patchCompany);

module.exports = router;
