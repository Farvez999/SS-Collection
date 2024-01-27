var express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');
const UPLOADS_FOLDER_USERS = "../public/image";
const productContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/', [productContent], isValidUser, createProduct);
router.put('/:id', userauthmiddleware.isValidUser, [productContent], updateProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/:id', userauthmiddleware.isValidUser, deleteProduct);

// router.post('/wishlist/add', isValidUser, createWishlist);

module.exports = router;