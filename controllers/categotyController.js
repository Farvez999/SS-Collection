const createError = require('http-errors');
const response = require("../helpers/response");
const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product');

//Create categories
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (name === "") {
      return res.status(400).json({ status: 400, message: "Category Name is required" });
    }

    let categoryImage = "";

    if (req.files && req.files.categoryImage && req.files.categoryImage[0]) {
      categoryImage = `${req.protocol}://${req.get('host')}/public/image/${req.files.categoryImage[0].filename}`;
    }


    const category = await Category.create({
      name: name,
      categoryImage: categoryImage,
    });

    res.status(201).json(response({ message: "Category created successfully", status: 201, data: category, type: "category" }));
  } catch (error) {
    console.error(error.message);
    next(createError(error));
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.find();
    res.status(200).json(response({ message: "Category fetched successfully", status: 200, data: category, type: "category" }));
  } catch (error) {
    next(createError(error));
  }
};


const updateCategory = async (req, res, next) => {
  let user = await User.findById(req.user);


  if (user.role == "admin") {
    try {
      const categoryId = await Category.findById(req.params.id);

      const { name } = req.body;

      if (req.files && req.files['categoryImage']) {
        let categoryimage = "";

        if (req.files.categoryImage[0]) {
          categoryimage = `${req.protocol}://${req.get('host')}/public/image/${req.files.categoryImage[0].filename}`;
        }
        let updateData = {
          name,
          categoryImage: categoryimage
        }
        // Use findByIdAndUpdate to partially update the category document
        const category = await Category.findByIdAndUpdate(
          categoryId,
          { $set: updateData }, // Use $set to update only the specified fields
          { new: true } // To return the updated document
        );

        if (!category) {
          return response(res.status(404).json({
            message: "Category not found",
            status: 404,
            data: null,
            type: "category",
          }));
        }

        res.status(200).json(response({ message: "Category updated successfully", status: 200, data: category, type: "category" }));
      } else {
        let updateData = {
          name,
          categoryImage: categoryId.categoryImage
        }
        // Use findByIdAndUpdate to partially update the category document
        const category = await Category.findByIdAndUpdate(
          categoryId,
          { $set: updateData }, // Use $set to update only the specified fields
          { new: true } // To return the updated document
        );
        res.status(200).json(response({ message: "Category updated successfully", status: 200, data: category, type: "category" }));
      }

    } catch (error) {
      next(createError(error));
    }

  }

};

const deleteCategory = async (req, res, next) => {

  let user = await User.findById(req.user);


  if (user.role == "admin") {
    try {
      const categoryId = await Category.findById(req.params.id);

      if (!categoryId) {
        res.status(404).json(response({ message: "Category not found", status: 404, data: null, type: "category" }));
      }

      //delete category
      await Category.findByIdAndDelete(categoryId);

      res.status(200).json(response({ message: "Category deleted successfully", status: 200, data: null, type: "category" }));

    } catch (error) {
      next(createError(error));
    }

  } else {

    return res.status(401).json({ status: 401, message: "UnAuthorized user" });

  }

};

module.exports = { createCategory, getCategory, updateCategory, deleteCategory, };