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

// const getProductFolders = async (req, res, next) => {
//   try {
//     const productFolder = await ProductFolder.find();

//     let user = await User.findById(req.user);
//     const userId = user._id;
//     console.log("dewrfewr", userId)

//     const product = productFolder.find(folder => folder.userId.equals(userId));
//     console.log("dewrfewr", product)

//     res.status(200).json(response({ message: "Product fetched successfully", status: 200, data: product, type: "productFolder" }));
//   } catch (error) {
//     next(createError(error));
//   }
// };

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

// const createProductFolder = async (req, res, next) => {
//   try {
//     const { productName, productDescription, productPrice, categoryId } = req.body;

//     let user = await User.findById(req.user);
//     const userId = user._id;

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


//     const productFolder = await ProductFolder.create({
//       productName: productName,
//       productDescription: productDescription,
//       productPrice: productPrice,
//       productImage: productImage,
//       categoryId,
//       userId
//     });

//     res.status(201).json(response({ message: "Product Folder created successfully", status: 201, data: productFolder, type: "productFolder" }));
//   } catch (error) {
//     console.error(error.message);
//     next(createError(error));
//   }
// };


const createFolderForProduct = async (req, res) => {
  try {
    const { folderName, productId,note } = req.body;

    // Find the user based on the logged-in user's ID
    let user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the folder already exists for this user
    let folder = await ProductFolder.findOne({ folderName, userId: user._id });
    if (!folder) {
      // If the folder doesn't exist, create it
      folder = new ProductFolder({
        folderName,
        userId: user._id,
        products: [{ productId, note }]  // Add the product with its note
      });
      await folder.save();

      // Add the folder to the user's folders array
      // user.folders.push(folder._id);
      // await user.save();
    } else {
      // If the folder exists, check if the product already exists in the folder
      const productExists = folder.products.some(p => p.productId.toString() === productId);
      if (!productExists) {
        folder.products.push({ productId, note });  // Add the product with its note
        await folder.save();
      }
    }

    res.status(201).json({ message: 'Folder and product added successfully!', folder });

  } catch (error) {
    console.error('Error creating folder or adding product:', error);
    res.status(500).json({ message: 'Error creating folder or adding product', error });
  }
};

// const getProductFolders = async (req, res) => {
//   try {
//     // Find the user based on the logged-in user's ID
//     let user = await User.findById(req.user._id).populate({
//       path: 'folders',
//       populate: {
//         path: 'products.productId',  // Populate product details
//         model: 'Product'
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Return the user's folders with products and notes
//     res.status(200).json({ folders: user.folders });

//   } catch (error) {
//     console.error('Error retrieving folders:', error);
//     res.status(500).json({ message: 'Error retrieving folders', error });
//   }
// };

const getAllFoldersForUser = async (req, res) => {
  try {
    // Find all folders for the logged-in user
    let folders = await ProductFolder.find({ userId: req.user}).populate('products.productId');

    if (!folders || folders.length === 0) {
      return res.status(404).json({ message: 'No folders found for this user' });
    }

    // Return the folders with their products and notes
    res.status(200).json({ folders });

  } catch (error) {
    console.error('Error retrieving folders for user:', error);
    res.status(500).json({ message: 'Error retrieving folders for user', error });
  }
};


const getProductFolder = async (req, res) => {
  try {
    
    const { folderId } = req.params;
    

    // Find the folder by ID and populate the products with their details
    let folder = await ProductFolder.findById(folderId).populate('products.productId');

    if (!folder) {
      return res.status(404).json({ message: 'Product folder not found' });
    }

    // Ensure the folder belongs to the logged-in user
    if (folder.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Return the folder with its products and notes
    res.status(200).json({ folder });

  } catch (error) {
    console.error('Error retrieving product folder:', error);
    res.status(500).json({ message: 'Error retrieving product folder', error });
  }
};


module.exports = { createFolderForProduct, getAllFoldersForUser,getProductFolder };