const createError = require('http-errors');
const response = require("../helpers/response");
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const ProductFolder = require('../models/ProductFolder');

//Create categories
// const createProduct = async (req, res, next) => {
//   try {
//     const { productName, productDescription, productPrice, categoryId } = req.body;

//     if (productName === "") {
//       return res.status(400).json({ status: 400, message: "Product Name is required" });
//     }
//     if (productDescription === "") {
//       return res.status(400).json({ status: 400, message: "Product Description is required" });
//     }
//     if (productPrice === "") {
//       return res.status(400).json({ status: 400, message: "Product price is required" });
//     }

//     const existingCategory = await Category.findById(categoryId);

//     if (!existingCategory) {
//       return res.status(404).json(response({ message: 'Category Id is not valid', type: "categories", status: "OK", statusCode: 200 }));
//     }

//     let productImage = "";

//     if (req.files && req.files.productImage && req.files.productImage[0]) {
//       productImage = `${req.protocol}://${req.get('host')}/public/image/${req.files.productImage[0].filename}`;
//     }


//     const product = await Product.create({
//       productName: productName,
//       productDescription: productDescription,
//       productPrice: productPrice,
//       productImage: productImage,
//       categoryId
//     });

//     res.status(201).json(response({ message: "Product created successfully", status: 201, data: product, type: "product" }));
//   } catch (error) {
//     console.error(error.message);
//     next(createError(error));
//   }
// };

const getProductFolders = async (req, res, next) => {
  try {
    const productFolder = await ProductFolder.find();

    let user = await User.findById(req.user);
    const userId = user._id;
    console.log("dewrfewr", userId)

    const product = productFolder.find(folder => folder.userId.equals(userId));
    console.log("dewrfewr", product)

    res.status(200).json(response({ message: "Product fetched successfully", status: 200, data: product, type: "productFolder" }));
  } catch (error) {
    next(createError(error));
  }
};

// const getProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     res.status(200).json(response({ message: "Product fetched successfully", status: 200, data: product, type: "product" }));
//   } catch (error) {
//     next(createError(error));
//   }
// };

// const getCategoryWise = async (req, res, next) => {
//   try {
//     const categoryId = req.params.id
//     const category = await Product.find({ categoryId: categoryId });

//     // console.log("=====>", category)
//     res.status(200).json(response({ message: "Category fetched successfully", status: 200, data: category, type: "category" }));
//   } catch (error) {
//     next(createError(error));
//   }
// };

// const updateProduct = async (req, res, next) => {
//   let user = await User.findById(req.user);


//   if (user.role == "admin") {
//     try {
//       const productId = await Product.findById(req.params.id);

//       const { productName, productDescription, productPrice } = req.body;

//       if (req.files && req.files['productImage']) {
//         let productImage = "";

//         if (req.files.productImage[0]) {
//           productImage = `${req.protocol}://${req.get('host')}/public/image/${req.files.productImage[0].filename}`;
//         }
//         let updateData = {
//           productName,
//           productDescription,
//           productPrice,
//           productImage: productImage
//         }
//         // Use findByIdAndUpdate to partially update the category document
//         const product = await Product.findByIdAndUpdate(
//           productId,
//           { $set: updateData }, // Use $set to update only the specified fields
//           { new: true } // To return the updated document
//         );

//         if (!product) {
//           return response(res.status(404).json({
//             message: "Product not found",
//             status: 404,
//             data: null,
//             type: "product",
//           }));
//         }

//         res.status(200).json(response({ message: "Product updated successfully", status: 200, data: product, type: "product" }));
//       } else {
//         let updateData = {
//           productName,
//           productDescription,
//           productPrice,
//           productImage: productId.productImage
//         }
//         // Use findByIdAndUpdate to partially update the category document
//         const product = await Product.findByIdAndUpdate(
//           productId,
//           { $set: updateData }, // Use $set to update only the specified fields
//           { new: true } // To return the updated document
//         );
//         res.status(200).json(response({ message: "Product updated successfully", status: 200, data: product, type: "product" }));
//       }

//     } catch (error) {
//       next(createError(error));
//     }

//   }

// };

// const deleteProduct = async (req, res, next) => {

//   let user = await User.findById(req.user);


//   if (user.role == "admin") {
//     try {
//       const productId = await Product.findById(req.params.id);

//       if (!productId) {
//         res.status(404).json(response({ message: "Product Id not found", status: 404, data: null, type: "product" }));
//       }

//       //delete category
//       await Product.findByIdAndDelete(productId);

//       res.status(200).json(response({ message: "Product deleted successfully", status: 200, data: null, type: "product" }));

//     } catch (error) {
//       next(createError(error));
//     }

//   } else {

//     return res.status(401).json({ status: 401, message: "UnAuthorized user" });

//   }

// };

const createProductFolder = async (req, res, next) => {
  try {
    const { productName, productDescription, productPrice, categoryId } = req.body;

    let user = await User.findById(req.user);
    const userId = user._id;

    if (productName === "") {
      return res.status(400).json({ status: 400, message: "Product Name is required" });
    }
    if (productDescription === "") {
      return res.status(400).json({ status: 400, message: "Product Description is required" });
    }
    if (productPrice === "") {
      return res.status(400).json({ status: 400, message: "Product price is required" });
    }

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json(response({ message: 'Category Id is not valid', type: "categories", status: "OK", statusCode: 200 }));
    }

    let productImage = "";

    if (req.files && req.files.productImage && req.files.productImage[0]) {
      productImage = `${req.protocol}://${req.get('host')}/public/image/${req.files.productImage[0].filename}`;
    }


    const productFolder = await ProductFolder.create({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productImage: productImage,
      categoryId,
      userId
    });

    res.status(201).json(response({ message: "Product Folder created successfully", status: 201, data: productFolder, type: "productFolder" }));
  } catch (error) {
    console.error(error.message);
    next(createError(error));
  }
};


module.exports = { createProductFolder, getProductFolders };