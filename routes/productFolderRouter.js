var express = require('express');
const {createFolderForProduct, getAllFoldersForUser, getProductFolder } = require('../controllers/productFolderController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);

router.post('/create-folder', userauthmiddleware.isValidUser, createFolderForProduct);
router.get('/user/folders', userauthmiddleware.isValidUser,getAllFoldersForUser);
router.get('/folders/:folderId',userauthmiddleware.isValidUser, getProductFolder);

module.exports = router;