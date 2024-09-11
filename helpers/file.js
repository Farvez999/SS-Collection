const multer = require('multer');
const path = require('path');

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    // Set the destination for uploaded files
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    // Set the file name to be the current timestamp + original name to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer middleware for filtering image files only
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Allowed file types
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
  const mimetype = fileTypes.test(file.mimetype); // Check MIME type

  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images (jpeg, jpg, png) are allowed')); // Reject the file
  }
};

// Multer upload setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5 MB
  fileFilter: fileFilter,
});

module.exports = upload;
