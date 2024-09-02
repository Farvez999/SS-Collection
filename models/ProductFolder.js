const mongoose = require('mongoose');

const productFolderSchema = new mongoose.Schema({
    folderName: { type: String, required: true },
    // productName: {
    //     type: String,
    //     required: [true, "Product name must be required"]
    // },
    // productDescription: {
    //     type: String,
    //     required: [true, "Product description must be required"]
    // },
    // productImage: {
    //     type: String,
    //     required: [true, "Product image must be required"]
    // },
    // productPrice: {
    //     type: Number,
    //     required: [true, "Product price must be required"]
    // },
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        note: { type: String } // Field to store a note associated with the product in the folder
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('ProductFolder', productFolderSchema);