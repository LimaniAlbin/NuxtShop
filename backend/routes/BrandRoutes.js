const express = require('express');
const upload = require('../middleware/upload');
const { getBrands, getBrandById, createBrand, editBrand, deleteBrand } = require('../controllers/BrandController');
const {validateBrand} = require("../validators/brandValidator");
const {validateImage} = require("../validators/imageValidator");

const router = express.Router();

router.get('/brands', getBrands);
router.get('/brands/:id', getBrandById)
router.post('/admin/brands', upload.single('logo'), validateBrand, validateImage, createBrand);
router.put('/admin/brands/:id', upload.single('logo'), validateBrand, validateImage, editBrand);
router.delete('/admin/brands/:id', deleteBrand);

module.exports = router;