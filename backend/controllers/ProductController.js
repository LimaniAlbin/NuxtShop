const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const slugify = require('slugify');

const getProducts = async (req, res) => {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
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
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).populate('brand');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product fetched successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get product', error });
    }
};

const createProduct = async (req, res) => {
    const { name, description, shortDescription, price, stock, brand } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
            return res.status(400).json({ message: 'Brand does not exist' });
        }

        const slug = await generateUniqueSlug(name);

        const newProduct = await Product.create({
            name,
            slug,
            description,
            shortDescription,
            price,
            stock,
            image,
            brand
        });

        res.status(201).json({ message: 'Product created successfully', newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, shortDescription, price, stock, brand } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
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

        // If the name is changed, update the slug
        if (name && name !== product.name) {
            product.slug = await generateUniqueSlug(name, id);
            product.name = name;
        }

        product.description = description || product.description;
        product.shortDescription = shortDescription || product.shortDescription;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        if (image) {
            product.image = image; // Update the image if provided
        }

        const updatedProduct = await product.save();

        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (deletedProduct.image) {
            await deleteImageIfNotInUse(deletedProduct.image);
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};


/**
 * Function to delete an image if it is not part of any product
 */
const deleteImageIfNotInUse = async (imageName) => {
    const productsUsingImage = await Product.find({ image: imageName });

    if (productsUsingImage.length === 0) {
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

/**
 * Function to generate a unique slug
 */
const generateUniqueSlug = async (name, productId = null) => {
    let slug = slugify(name, { lower: true, strict: true });
    let existingProduct = await Product.findOne({ slug });

    let count = 1;
    while (existingProduct && (!productId || existingProduct._id.toString() !== productId.toString())) {
        slug = `${slugify(name, { lower: true, strict: true })}-${count}`;
        existingProduct = await Product.findOne({ slug });
        count++;
    }
    return slug;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct
};
