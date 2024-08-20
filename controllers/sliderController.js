const createError = require('http-errors');
const response = require("../helpers/response");
const Slider = require('../models/Slider');
const User = require('../models/User');
const { createFileDetails } = require('../helpers/image.helper');

//Create categories
const createSlider = async (req, res, next) => {
  try {
    let sliderImage = "";

    if (req.files && req.files.sliderImage && req.files.sliderImage[0]) {
      sliderImage = createFileDetails('image', req?.files?.sliderImage[0].filename);
    }


    const slider = await Slider.create({
      sliderImage: sliderImage,
    });

    res.status(201).json(response({ message: "Slider created successfully", status: 201, data: slider, type: "slider" }));
  } catch (error) {
    console.error(error.message);
    // next(createError(error));
  }
};

const getSlider = async (req, res, next) => {
  try {
    const slider = await Slider.find();
    res.status(200).json(response({ message: "Slider fetched successfully", status: 200, data: slider, type: "slider" }));
  } catch (error) {
    next(createError(error));
  }
};


// const updateCategory = async (req, res, next) => {
//   let user = await User.findById(req.user);


//   if (user.role == "admin") {
//     try {
//       const categoryId = await Category.findById(req.params.id);

//       const { name } = req.body;

//       if (req.files && req.files['categoryImage']) {
//         let categoryimage = "";

//         if (req.files.categoryImage[0]) {
//           categoryimage = `${req.protocol}://${req.get('host')}/public/image/${req.files.categoryImage[0].filename}`;
//         }
//         let updateData = {
//           name,
//           categoryImage: categoryimage
//         }
//         // Use findByIdAndUpdate to partially update the category document
//         const category = await Category.findByIdAndUpdate(
//           categoryId,
//           { $set: updateData }, // Use $set to update only the specified fields
//           { new: true } // To return the updated document
//         );

//         if (!category) {
//           return response(res.status(404).json({
//             message: "Category not found",
//             status: 404,
//             data: null,
//             type: "category",
//           }));
//         }

//         res.status(200).json(response({ message: "Category updated successfully", status: 200, data: category, type: "category" }));
//       } else {
//         let updateData = {
//           name,
//           categoryImage: categoryId.categoryImage
//         }
//         // Use findByIdAndUpdate to partially update the category document
//         const category = await Category.findByIdAndUpdate(
//           categoryId,
//           { $set: updateData }, // Use $set to update only the specified fields
//           { new: true } // To return the updated document
//         );
//         res.status(200).json(response({ message: "Category updated successfully", status: 200, data: category, type: "category" }));
//       }

//     } catch (error) {
//       next(createError(error));
//     }

//   }

// };

const deleteSlider = async (req, res, next) => {

  let user = await User.findById(req.user);


  if (user.role == "admin") {
    try {
      const sliderId = await Slider.findById(req.params.id);

      if (!sliderId) {
        res.status(404).json(response({ message: "Slider not found", status: 404, data: null, type: "slider" }));
      }

      //delete category
      await Slider.findByIdAndDelete(sliderId);

      res.status(200).json(response({ message: "Slider deleted successfully", status: 200, data: null, type: "slider" }));

    } catch (error) {
      next(createError(error));
    }

  } else {

    return res.status(401).json({ status: 401, message: "UnAuthorized user" });

  }

};

module.exports = { createSlider, getSlider, deleteSlider };