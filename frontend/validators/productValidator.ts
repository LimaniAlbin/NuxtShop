import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }),
    description: z.string().min(1, { message: 'Product description is required' }),
    shortDescription: z.string().min(1, { message: 'Short description is required' }),
    price: z.coerce.number().min(1, { message: 'Price must be greater than 0' }),
    stock: z.coerce.number().min(1, { message: 'Stock quantity must be greater than 0' }),
    brand: z.string().min(1, { message: 'Brand is required' }),
    category: z.string().min(1, { message: 'Category is required' }),
    image: z.instanceof(File, { message: 'Image is required' })
});

export const updateProductSchema = productSchema.partial({
    image: true,
});