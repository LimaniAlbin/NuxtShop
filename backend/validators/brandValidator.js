const { z } = require('zod');

const brandSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Brand name is required' })
        .trim(),
    description: z
        .string()
        .min(1, { message: 'Brand description is required' })
        .trim(),
    logo: z
        .string()
        .min(1, { message: 'Logo is required' }),
});

const validateBrand = (req, res, next) => {
    if (req.file) {
        req.body.logo = req.file.filename;
    }

    const schema = req.method === 'POST'
        ? brandSchema
        : brandSchema.partial({ logo: true });

    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
    }

    next();
};

module.exports = { validateBrand };