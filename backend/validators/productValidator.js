const { z } = require('zod')

const productSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Product name is required' })
        .trim(),
    description: z
        .string()
        .min(1, { message: 'Product description is required' })
        .trim(),
    price: z
        .number()
        .min(0, { message: 'Price must be a positive value' }),
    stock: z
        .number()
        .min(0, { message: 'Stock quantity must be at least 0' }),
    brand: z
        .string()
        .min(1, { message: 'Brand is required' }),
    image: z
        .string()
        .min(1, { message: 'Image is required' })
})

const validateProduct = (req, res, next) => {
    req.body.price = req.body.price ? Number(req.body.price) : undefined;
    req.body.stock = req.body.stock ? Number(req.body.stock) : undefined;

    if (req.file) {
        req.body.image = req.file.filename;
    }

    // Require image only for product creation
    const schema = req.method === 'POST'
        ? productSchema
        : productSchema.partial({ image: true }); // ✅ Allows image to be optional on update

    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
    }

    next();
};

module.exports = { validateProduct }