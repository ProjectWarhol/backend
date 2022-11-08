const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Create a new Company
router.post('/', isLoggedIn, company.createCompany);

// Delete Company
router.delete('/', isLoggedIn, company.deleteCompany);

// Patch Company
router.patch('/', isLoggedIn, company.patchCompany);

module.exports = router;
