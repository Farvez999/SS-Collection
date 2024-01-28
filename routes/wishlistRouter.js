var express = require('express');
const { createWishlist, getWishlists, getWishlist } = require('../controllers/wishlistController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const { isValidUser } = require('../middleWares/auth');


router.post('/', isValidUser, createWishlist);
router.get('/', getWishlists);
router.get('/:id', getWishlist);

module.exports = router;