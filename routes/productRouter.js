var express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getCategoryWise, findKeywords, searchProduct } = require('../controllers/productController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/', userauthmiddleware.isValidUser, createProduct);
router.put('/:id', userauthmiddleware.isValidUser, updateProduct);
router.get('/', getProducts);
router.get('/keywords', findKeywords);
router.get('/search', searchProduct);
router.get('/:id', getProduct);
router.get('/category-wise/:id', getCategoryWise);


router.delete('/:id', userauthmiddleware.isValidUser, deleteProduct);

module.exports = router;