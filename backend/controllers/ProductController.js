const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Brand = require('../models/Brand');

const getProducts = async (req, res) => {
    const {page = 1, limit = 8} = req.query;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
            .populate('brand');

        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            message: 'Product list fetched successfully',
            products,
            total: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({message: 'Failed to get products', error});
    }
};

const getProductById = async (req, res) => {
    const {id} = req.params;

    try {
        const product = await Product.findById(id).populate('brand');

        if (!product) {
            res.status(404).json({message: 'Product not found'});
        }

        res.status(200).json({message: 'Product fetched successfully', product});
    } catch (error) {
        res.status(500).json({message: 'Failed to get product', error});
    }
}

const createProduct = async (req, res) => {
    const {name, description, price, stock, brand} = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
            return res.status(400).json({message: 'Brand does not exist'});
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            image,
            brand
        })

        res.status(201).json({message: 'Product created successfully', newProduct});
    } catch (error) {
        res.status(500).json({message: 'Failed to create product', error});
    }
}

const editProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, stock, brand} = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        if (brand) {
            const brandExists = await Brand.findById(brand);
            if (!brandExists) {
                return res.status(400).json({ message: 'Brand does not exist' });
            }
            product.brand = brand;
        }

        if (product.image && image && product.image !== image) {
            await deleteImageIfNotInUse(product.image);
        }

        // Update the product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        if (image) {
            product.image = image; // Update the image if provided
        }

        const updatedProduct = await product.save(); // Save the updated product

        res.status(200).json({message: 'Product updated successfully', updatedProduct});
    } catch (error) {
        res.status(500).json({message: 'Failed to update product', error});
    }
};

const deleteProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({message: 'Product not found'});
        }

        // Delete the old image if it's not in use by any other product
        if (deletedProduct.image) {
            await deleteImageIfNotInUse(deletedProduct.image);
        }

        res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete product', error});
    }
}

const deleteImageIfNotInUse = async (imageName) => {
    const productsUsingImage = await Product.find({image: imageName});

    // If no products are using the image, delete it
    if (productsUsingImage) {
        const imagePath = path.join(__dirname, '../uploads', imageName);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Failed to delete image: ${imagePath}`, err);
            } else {
                console.log(`Image deleted: ${imagePath}`);
            }
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct
}