import { z } from 'zod';

export const brandSchema = z.object({
    name: z.string().min(1, { message: 'Brand name is required' }),
    description: z.string().min(1, { message: 'Brand description is required' }),
    logo: z.instanceof(File, { message: 'Logo is required' })
});

export const updateBrandSchema = brandSchema.partial({
    logo: true,
});