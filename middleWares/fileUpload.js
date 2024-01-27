const multer = require("multer");
const path = require("path");
const fs = require("fs");

const configureFileUpload = (destinationPath) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', "image/JPG"];
            if (allowedMimeTypes.includes(file.mimetype)) {
                const folderPath = path.join(__dirname, destinationPath);
                createFolderIfNotExists(folderPath);
                cb(null, folderPath);
            } else {
                cb(new Error('Invalid file type'));
            }
        },
        filename: function (req, file, cb) {
            const name = Date.now() + '-' + file.originalname;

            // Store the filename in the req object for later use
            req.fileName = name;

            cb(null, name);
        },
    });

    const fileFilter = (req, file, cb) => {
        cb(null, true); // Allow all file types specified in storage
    };

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 100 * 1024 * 1024,
        },
    }).fields([
        { name: 'uploadId', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'categoryImage', maxCount: 1 },
        { name: 'productImage', maxCount: 1 },
        { name: 'categoryVideo', maxCount: 1 },
        { name: 'image', maxCount: 1 },
    ]);

    return upload;
};

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

module.exports = configureFileUpload;