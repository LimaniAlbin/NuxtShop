const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Category list fetched successfully', categories });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get categories', error });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get category', error });
    }
};

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = await Category.create({ name, description });

        res.status(201).json({ message: 'Category created successfully', newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error });
    }
};

const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Update fields
        category.name = name || category.name;
        category.description = description || category.description;

        const updatedCategory = await category.save();
        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    editCategory,
    deleteCategory
};
