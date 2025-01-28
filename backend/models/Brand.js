const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Brand description is required'],
        trim: true,
    },
    logo: {
        type: String,
    }
}, {timestamps: true});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;