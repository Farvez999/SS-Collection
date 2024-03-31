const createError = require('http-errors');
const response = require("../helpers/response");
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const { createFileDetails } = require('../helpers/image.helper');
const QueryBuilder = require('../builder/QueryBuilder');

//Create categories
const createProduct = async (req, res, next) => {
  try {
    const { productName, productDescription, productPrice, categoryId, productImage } = req.body;
    console.log("Body ------------>", req.body)

    if (productName === "") {
      return res.status(400).json({ status: 400, message: "Product Name is required" });
    }
    if (productDescription === "") {
      return res.status(400).json({ status: 400, message: "Product Description is required" });
    }
    if (productPrice === "") {
      return res.status(400).json({ status: 400, message: "Product price is required" });
    }

    if (productImage === "") {
      return res.status(400).json({ status: 400, message: "Product Image is required" });
    }

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json(response({ message: 'Category Id is not valid', type: "categories", status: "OK", statusCode: 200 }));
    }

    // let productImage = "";

    // if (req.files && req.files.productImage && req.files.productImage[0]) {
    //   productImage = createFileDetails('image', req?.files?.productImage[0].filename);
    // }

    // if (req.files && req.files.productImage && req.files.productImage[0]) {
    //   productImage = createFileDetails('image', req?.files?.productImage[0].filename)
    // }


    const product = await Product.create({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productImage: productImage,
      categoryId
    });

    res.status(201).json(response({ message: "Product created successfully", status: 201, data: product, type: "product" }));
  } catch (error) {
    console.error(error.message);
    next(createError(error));
  }
};

const getProducts = async (req, res, next) => {
  try {
    const product = await Product.find();
    res.status(200).json(response({ message: "Product fetched successfully", status: 200, data: product, type: "product" }));
  } catch (error) {
    next(createError(error));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(response({ message: "Product fetched successfully", status: 200, data: product, type: "product" }));
  } catch (error) {
    next(createError(error));
  }
};

const getCategoryWise = async (req, res, next) => {
  try {
    const categoryId = req.params.id
    const category = await Product.find({ categoryId: categoryId });

    // console.log("=====>", category)
    res.status(200).json(response({ message: "Category fetched successfully", status: 200, data: category, type: "category" }));
  } catch (error) {
    next(createError(error));
  }
};

const updateProduct = async (req, res, next) => {

  let user = await User.findById(req.user);


  if (user.role == "admin") {
    try {
      const productId = await Product.findById(req.params.id);

      const { productName, productDescription, productPrice } = req.body;

      let updateData = {
        productName,
        productDescription,
        productPrice,
        // productImage: productImage
      }

      // Use findByIdAndUpdate to partially update the category document
      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData }, // Use $set to update only the specified fields
        { new: true } // To return the updated document
      );
      res.status(200).json(response({ message: "Product updated successfully", status: 200, data: product, type: "product" }));
    }

    catch (error) {
      next(createError(error));
    }

  }

};

const deleteProduct = async (req, res, next) => {

  let user = await User.findById(req.user);


  if (user.role == "admin") {
    try {
      const productId = await Product.findById(req.params.id);

      if (!productId) {
        res.status(404).json(response({ message: "Product Id not found", status: 404, data: null, type: "product" }));
      }

      //delete category
      await Product.findByIdAndDelete(productId);

      res.status(200).json(response({ message: "Product deleted successfully", status: 200, data: null, type: "product" }));

    } catch (error) {
      next(createError(error));
    }

  } else {

    return res.status(401).json({ status: 401, message: "UnAuthorized user" });

  }

};

const findKeywords = async (req, res, next) => {
  try {
    const uniqueKeywords = await Product.aggregate([

      // Unwind the array to get separate documents for each keyword
      { $unwind: "$productDescription" },
      // Group by keyword and count occurrences
      {
        $group: {
          _id: "$productDescription",
          count: { $sum: 1 }
        }
      },
      // Project to rename fields and sort by keyword
      {
        $project: {
          keyword: "$_id",
          count: 1,
          _id: 0
        }
      },
      // Sort by keyword alphabetically
      { $sort: { count: -1 } }

    ]);

    res.status(200).json(response({ message: "Product deleted successfully", status: 200, data: uniqueKeywords, type: "product" }));
  } catch (error) {
    next(createError(error));
  }
}


const searchProduct = async (req, res, next) => {
  const { query } = req.query;
  console.log(req.query)

  const userModel = new QueryBuilder(Product.find(), req.query)
    .search()
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await userModel.modelQuery;
  const meta = await userModel.meta();

  // console.log("object", result)

  res.json({ result });

  // if (!keyword) {
  //   return res.status(400).json({ error: 'Keyword parameter is required' });
  // }

  // const products = await Product.find();
  // // console.log(products)

  // // Filter products based on keyword in productName or productDescription
  // const filteredProducts = products.filter(product =>
  //   // product.productName.toLowerCase().includes(keyword.toLowerCase()) ||
  //   (typeof product.productDescription === 'string' && product.productDescription.toLowerCase().includes(keyword.toLowerCase()))
  // );

  // res.json({ products: filteredProducts });
}

// const findKeywords = async (body) => {

//   const uniqueKeywords = await Product.aggregate([

//     // Unwind the array to get separate documents for each keyword
//     { $unwind: "$keywords" },
//     // Group by keyword and count occurrences
//     {
//       $group: {
//         _id: "$keywords",
//         count: { $sum: 1 }
//       }
//     },
//     // Project to rename fields and sort by keyword
//     {
//       $project: {
//         keyword: "$_id",
//         count: 1,
//         _id: 0
//       }
//     },
//     // Sort by keyword alphabetically
//     { $sort: { count: -1 } }
//   ]);

//   return uniqueKeywords

// }



module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getCategoryWise, findKeywords, searchProduct };