const createError = require('http-errors');
const response = require("../helpers/response");
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const ProductFolder = require('../models/ProductFolder');
const mongoose = require('mongoose');


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
      // return res.status(404).json({ message: 'No folders found for this user' });
      return res.status(200).json({ folders });
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

const updateFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body; // Assuming these are the fields you want to update

    // Validate folderId format
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    // Find the folder by ID
    let folder = await ProductFolder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    // Ensure the folder belongs to the logged-in user
    if (folder.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    

    // Update the folder
    folder.folderName = name || folder.folderName;
    await folder.save();

    // Return the updated folder
    res.status(200).json({ folder });

  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ message: 'Error updating folder', error });
  }
};


const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    // Validate folderId format
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: 'Invalid folder ID format' });
    }

    // Find the folder by ID
    let folder = await ProductFolder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Ensure the folder belongs to the logged-in user
    if (folder.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete the folder
    await ProductFolder.findByIdAndDelete(folderId);

    // Return success message
    res.status(200).json({ message: 'Folder successfully deleted' });

  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Error deleting folder', error });
  }
};

const updateProductNote = async (req, res) => {
  try {
    const { folderId, productId } = req.params;
    const { note } = req.body; // New note content

    // Validate folderId and productId format
    if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid folder or product ID format' });
    }

    // Find the folder by ID
    const folder = await ProductFolder.findById(folderId);
    console.log("🚀 ~ updateProductNote ~ folder:", folder)

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    console.log("🚀 ~ updateProductNote ~ req.user:", req.user)
    // Ensure the folder belongs to the logged-in user
    if (folder.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    

    // Find the product in the folder
    const product = folder.products.id(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in folder' });
    }

    // Update the product's note
    product.note = note || product.note;

    // Save the updated folder
    await folder.save();

    // Return the updated product with note
    res.status(200).json({ product });

  } catch (error) {
    console.error('Error updating product note:', error);
    res.status(500).json({ message: 'Error updating product note', error });
  }
};

// const deleteProductFromFolder = async (req, res) => {
//   try {
//     const { folderId, productId } = req.params;

//     // Validate folderId and productId format
//     if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: 'Invalid folder or product ID format' });
//     }

//     // Find the folder by ID
//     let folder = await ProductFolder.findById(folderId);

//     if (!folder) {
//       return res.status(404).json({ message: 'Folder not found' });
//     }

//     // Ensure the folder belongs to the logged-in user
//     if (folder.userId.toString() !== req.user.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Find the product in the folder's products array
//     const productIndex = folder.products.findIndex(
//       (product) => product._id.toString() === productId   
//     );

//     if (productIndex === -1) {
//       return res.status(404).json({ message: 'Product not found in folder' });
//     }

//     // Remove the product from the array
//     folder.products.splice(productIndex, 1);

//     // Save the folder after removal
//     await folder.save();

//     // Return success message
//     res.status(200).json({ message: 'Product successfully deleted from folder', folder });

//   } catch (error) {
//     console.error('Error deleting product from folder:', error);
//     res.status(500).json({ message: 'Error deleting product from folder', error });
//   }
// };

const deleteProductFromFolder = async (req, res) => {
  try {
    const { folderId, productId } = req.params;

    // Validate folderId and productId format
    if (!mongoose.Types.ObjectId.isValid(folderId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid folder or product ID format' });
    }

    // Find the folder by ID
    let folder = await ProductFolder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Ensure the folder belongs to the logged-in user
    if (folder.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the product in the folder's products array
    const productIndex = folder.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in folder' });
    }

    // Remove the product from the array
    folder.products.splice(productIndex, 1);

    // If the folder has no more products, delete the folder
    if (folder.products.length === 0) {
      await ProductFolder.findByIdAndDelete(folderId);
      return res.status(200).json({ message: 'Product deleted and folder removed because it was empty' });
    }

    // Otherwise, save the folder after removal
    await folder.save();

    // Return success message
    res.status(200).json({ message: 'Product successfully deleted from folder', folder });

  } catch (error) {
    console.error('Error deleting product from folder:', error);
    res.status(500).json({ message: 'Error deleting product from folder', error });
  }
};






module.exports = { createFolderForProduct, getAllFoldersForUser,getProductFolder,updateFolder, deleteFolder ,updateProductNote, deleteProductFromFolder};