const express = require('express');
const upload = require('../middleware/upload');
const { getProducts, getProductById, createProduct, editProduct, deleteProduct } = require('../controllers/ProductController');
const { validateProduct } = require('../validators/productValidator');
const { validateImage } = require('../validators/imageValidator');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById)
router.post('/admin/products', upload.single('image'), validateProduct, validateImage, createProduct);
router.put('/admin/products/:id', upload.single('image'), validateProduct, validateImage, editProduct);
router.delete('/admin/products/:id', deleteProduct);

module.exports = router;