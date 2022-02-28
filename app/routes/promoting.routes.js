const express = require('express');

const router = express.Router();
const promoting = require('../controllers/promoting.controller');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

// Get users promoted by user
router.get('/promotes', isLoggedIn, promoting.userPromotes);

// Post user promotes
router.post('/promotes', isLoggedIn, promoting.createOne);

// Delete user promotes
router.delete('/promotes', isLoggedIn, promoting.deleteOne);
