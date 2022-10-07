const express = require('express');

const router = express.Router();
const company = require('../controllers/company.controller');
// const {
//   checkUserIdentity,
// } = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

module.exports = router;

// Create a company
router.post('/', isLoggedIn, company.createCompany);

// Delete a company
router.delete('/', isLoggedIn, company.deleteCompany);

// Patch a company
router.patch('/', isLoggedIn, company.patchCompany);
