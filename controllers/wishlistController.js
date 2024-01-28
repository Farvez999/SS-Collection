const createError = require('http-errors');
const response = require("../helpers/response");
const Product = require('../models/Product');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');


//Create Wishlist
const createWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.body.userId);
    const userId = user.id;

    // Check if the product is already in the user's wishlist
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });
    console.log("existingWishlistItem", existingWishlistItem)

    if (existingWishlistItem) {
      return res.status(400).json(response({ message: "Product is already in the wishlist", status: 400, type: "wishlist" }));
    }

    // Create a new wishlist item
    const wishlistItem = await Wishlist.create({ userId, productId });

    res.status(201).json(response({ message: "Wishlist Added successfully", status: 201, data: wishlistItem, type: "wishlist" }));
  } catch (error) {
    console.error(error.message);
    next(createError(error));
  }
};

const getWishlists = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.find();
    res.status(200).json(response({ message: "Wishlist fetched successfully", status: 200, data: wishlistItem, type: "wishlist" }));
  } catch (error) {
    next(createError(error));
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);
    res.status(200).json(response({ message: "Wishlist fetched successfully", status: 200, data: wishlistItem, type: "wishlist" }));
  } catch (error) {
    next(createError(error));
  }
};


module.exports = { createWishlist, getWishlists, getWishlist }; 