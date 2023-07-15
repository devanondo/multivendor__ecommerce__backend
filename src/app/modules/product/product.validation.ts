import { z } from 'zod';
import { visibility } from './product.constants';

const createProductZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Product name required',
        }),
        category: z.string({
            required_error: 'Product category required',
        }),
        sub_category: z.string().optional(),
        price: z.number({
            required_error: 'Product Price required',
        }),
        stocked: z.string({
            required_error: 'Product stock required',
        }),
        description: z.string({
            required_error: 'Product description required',
        }),
        variations: z.array(z.string().optional()),
        weight: z.number().optional(),
        diamention: z.string().optional(),
        features: z.string().optional(),
        brand: z.string({
            required_error: 'Product brand required',
        }),
        shop: z.string({
            required_error: 'Shop is required',
        }),
    }),
});

const updateProductZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        sub_category: z.string().optional(),
        price: z.number().optional(),
        stocked: z.string().optional(),
        description: z.string().optional(),
        variations: z.array(z.string().optional()),
        weight: z.number().optional(),
        diamention: z.string().optional(),
        features: z.string().optional(),
        brand: z.string().optional(),
    }),
});
const updateProductVislibilityZodSchema = z.object({
    body: z.object({
        visibility: z.enum(['private', 'public', 'protected'] as [
            string,
            ...string[]
        ]),
    }),
});
const updateProductVislibilityAdminZodSchema = z.object({
    body: z.object({
        visibility: z.enum([...visibility] as [string, ...string[]]),
    }),
});

export const ProductZodValidation = {
    createProductZodSchema,
    updateProductZodSchema,
    updateProductVislibilityZodSchema,
    updateProductVislibilityAdminZodSchema,
};
