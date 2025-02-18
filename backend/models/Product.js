const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Product short description is required'],
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
        stockStatus: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            default: 'In Stock',
        },
        image: {
            type: String,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Brand is required'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
    }, {timestamps: true,}
);


// Pre-save hook to update stockStatus based on stock level
productSchema.pre('save', function (next) {
    if (this.stock === 0) {
        this.stockStatus = 'Out of Stock';
    } else if (this.stock < 5) {
        this.stockStatus = 'Low Stock';
    } else {
        this.stockStatus = 'In Stock';
    }
    next()
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;