const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name must be required"],
    },
    categoryImage: {
        type: String,
        required: [true, "Category image must be required"],
        trim: true,
    },
},
    { timestamps: true },);

module.exports = mongoose.model('Category', categorySchema);