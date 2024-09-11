var express = require('express');
const {createFolderForProduct, getAllFoldersForUser, getProductFolder, updateFolder, deleteFolder, updateProductNote, deleteProductFromFolder } = require('../controllers/productFolderController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);

router.post('/create-folder', userauthmiddleware.isValidUser, createFolderForProduct);
router.get('/user/folders', userauthmiddleware.isValidUser,getAllFoldersForUser);
router.get('/folders/:folderId',userauthmiddleware.isValidUser, getProductFolder);
router.put('/folders/:folderId',userauthmiddleware.isValidUser, updateFolder);
router.put('/folders/:folderId/products/:productId',userauthmiddleware.isValidUser, updateProductNote);
router.delete('/folders/:folderId',userauthmiddleware.isValidUser, deleteFolder);
router.delete('/folders/:folderId/products/:productId',userauthmiddleware.isValidUser, deleteProductFromFolder);

module.exports = router;