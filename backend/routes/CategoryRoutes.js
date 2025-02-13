const express = require('express');
const {getCategories, getCategoryById, createCategory, editCategory, deleteCategory} = require("../controllers/CategoryController");
const {validateCategory} = require("../validators/categoryValidator");

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/admin/categories', validateCategory, createCategory);
router.put('/admin/categories/:id', validateCategory, editCategory);
router.delete('/admin/categories/:id', deleteCategory);

module.exports = router;