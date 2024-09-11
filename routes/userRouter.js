var express = require('express');
const { signUp, signIn, processForgetPassword, verifyOneTimeCode, updatePassword, updateUser, getProfile } = require('../controllers/userController');
var router = express.Router();
const userauthmiddleware = require("../middleWares/auth");

const upload = require('../helpers/file'); // Import the multer config from file.js

/* GET users listing. */
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/my-profile',userauthmiddleware.isValidUser,getProfile);
router.post('/forget-password', processForgetPassword);
router.post('/verify', verifyOneTimeCode);
router.post('/update-password', updatePassword);
// router.put('/updateUser',userauthmiddleware.isValidUser, upload.single('profileImage'), updateUser);
router.put('/updateUser',userauthmiddleware.isValidUser, updateUser);

module.exports = router;
