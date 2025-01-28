const fs = require('fs');
const path = require('path');
const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Brand list fetched successfully', brands });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get brands', error });
    }
};

const getBrandById = async (req, res) => {
    const { id } = req.params;

    try {
        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.status(200).json({ message: 'Brand fetched successfully', brand });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get brand', error });
    }
};

const createBrand = async (req, res) => {
    const { name } = req.body;
    const logo = req.file ? req.file.filename : null;

    try {
        const newBrand = await Brand.create({ name, logo });

        res.status(201).json({ message: 'Brand created successfully', newBrand });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create brand', error });
    }
};

const editBrand = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const logo = req.file ? req.file.filename : null;

    try {
        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        if (brand.logo && logo && brand.logo !== logo) {
            await deleteImageIfNotInUse(brand.logo);
        }

        // Update fields
        brand.name = name || brand.name;
        if (logo) {
            brand.logo = logo;
        }

        const updatedBrand = await brand.save();
        res.status(200).json({ message: 'Brand updated successfully', updatedBrand });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update brand', error });
    }
};

const deleteBrand = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);

        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        // Remove the logo if no other brands are using it
        if (deletedBrand.logo) {
            await deleteImageIfNotInUse(deletedBrand.logo);
        }

        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete brand', error });
    }
};

// Utility function to delete unused images
const deleteImageIfNotInUse = async (imageName) => {
    const brandsUsingImage = await Brand.find({ logo: imageName });

    if (!brandsUsingImage.length) {
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
    getBrands,
    getBrandById,
    createBrand,
    editBrand,
    deleteBrand
};
