const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive value'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            default: 0,
        },
        image: {
            type: String,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Brand is required'],
        }
    }, {timestamps: true,}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;