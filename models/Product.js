const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product name must be required"]
    },
    productDescription: {
        type: String,
        required: [true, "Product description must be required"]
    },
    productImage: {
        type: String,
        required: [true, "Product image must be required"]
    },
    productPrice: {
        type: Number,
        required: [true, "Product price must be required"]
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

module.exports = mongoose.model('Product', productSchema);