const fs = require("fs");
const util = require("util");
const unlinkSync = util.promisify(fs.unlink); const unlinkImage = async (path) => {
    const modifiedPath = `.${path}`;
    try {
        if (fs.existsSync(modifiedPath)) {
            console.log("path found ");
            await unlinkSync(modifiedPath);
        }
    } catch (err) {
        throw new Error(`Error deleting file: ${err.message}`);
    }
};

const createFileDetails = (folderName, filename) => {
    return `/${folderName}/${filename}`;
};

module.exports = { unlinkImage, createFileDetails };