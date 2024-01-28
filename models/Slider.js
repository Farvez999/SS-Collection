const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    sliderImage: {
        type: String,
        required: [true, "Slider image must be required"],
        trim: true,
    },
},
    { timestamps: true },);

module.exports = mongoose.model('Slider', sliderSchema);