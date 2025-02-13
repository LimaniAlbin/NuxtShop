const { z } = require('zod');

const categorySchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Category name is required' })
        .trim(),
    description: z
        .string()
        .min(1, { message: 'Category description is required' })
        .trim()
});

const validateCategory = (req, res, next) => {
    const parsedData = categorySchema.safeParse(req.body);


    if (!parsedData.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsedData.error.errors });
    }

    next();
};

module.exports = { validateCategory };