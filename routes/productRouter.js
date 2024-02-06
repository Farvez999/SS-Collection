var express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getCategoryWise } = require('../controllers/productController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/', [productContent], createProduct);
router.put('/:id', [productContent], updateProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/category-wise/:id', getCategoryWise);
router.delete('/:id', userauthmiddleware.isValidUser, deleteProduct);

module.exports = router;