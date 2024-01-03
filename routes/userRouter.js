var express = require('express');
const { signUp, signIn, processForgetPassword, verifyOneTimeCode, updatePassword } = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/forget-password', processForgetPassword);
router.post('/verify', verifyOneTimeCode);
router.post('/update-password', updatePassword);

module.exports = router;
