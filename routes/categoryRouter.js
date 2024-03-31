var express = require('express');
const { createCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/categotyController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const UPLOADS_FOLDER_USERS = "../public/image";
const uploadContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/add', userauthmiddleware.isValidUser, createCategory);
router.put('/:id', userauthmiddleware.isValidUser, [uploadContent], updateCategory);
router.get('/', getCategory);
router.delete('/:id', userauthmiddleware.isValidUser, deleteCategory);

module.exports = router;