var express = require('express');
const { createProductFolder, getProductFolders } = require('../controllers/productFolderController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/', userauthmiddleware.isValidUser, [productContent], isValidUser, createProductFolder);
// router.put('/:id', userauthmiddleware.isValidUser, [productContent], updateProduct);
router.get('/', userauthmiddleware.isValidUser, getProductFolders);
// router.get('/:id', getProduct);
// router.get('/category-wise/:id', getCategoryWise);
// router.delete('/:id', userauthmiddleware.isValidUser, deleteProduct);

module.exports = router;