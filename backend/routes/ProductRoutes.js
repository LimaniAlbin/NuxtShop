const express = require('express');
const upload = require('../middleware/upload');
const { getProducts, getProductById, createProduct, editProduct, deleteProduct } = require('../controllers/ProductController');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById)
router.post('/admin/products', upload.single('image'), createProduct);
router.put('/admin/products/:id', upload.single('image'), editProduct);
router.delete('/admin/products/:id', deleteProduct);

module.exports = router;