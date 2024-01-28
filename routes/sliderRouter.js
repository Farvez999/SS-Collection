var express = require('express');
const { createSlider, getSlider, deleteSlider } = require('../controllers/sliderController');
var router = express.Router();
const configureFileUpload = require("../middleWares/fileUpload");
const userauthmiddleware = require("../middleWares/auth");
const UPLOADS_FOLDER_USERS = "../public/image";
const uploadContent = configureFileUpload(UPLOADS_FOLDER_USERS);


router.post('/', [uploadContent], createSlider);
router.get('/', getSlider);
router.delete('/:id', userauthmiddleware.isValidUser, deleteSlider);

module.exports = router;