const express = require('express');

const router = express.Router();
const employment = require('../controllers/employment.controller');
// const {
//   checkUserIdentity,
// } = require('../middlewares/authentication.middleware');
const { isLoggedIn } = require('../middlewares/authorization.middleware');

router.get('/:userId', isLoggedIn, employment.userIsEmployedBy);
router.post('/:userId', isLoggedIn, employment.employOneUser);
// router.delete('/:userId', isLoggedIn, employment.unemployOneUser);

module.exports = router;
