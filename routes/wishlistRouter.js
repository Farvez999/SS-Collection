var express = require('express');
const { createWishlist, getWishlists, getWishlist, myWishlist, removeWishlist } = require('../controllers/wishlistController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');


router.post('/', isValidUser, createWishlist);
router.post('/remove', removeWishlist);
router.get('/', getWishlists);
router.get('/wishlist', myWishlist);
router.get('/:id', getWishlist);

module.exports = router;