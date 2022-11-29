const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Create a new Company
router.post('/', isLoggedIn, company.createOneCompany);

// Delete Company
router.delete('/', isLoggedIn, company.deleteOneCompany);

// Patch Company
router.patch('/', isLoggedIn, company.patchOneCompany);

module.exports = router;
