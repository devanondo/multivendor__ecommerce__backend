import { z } from 'zod';

const createShopZodSchema = z.object({
    body: z.object({
        shop_name: z.string({
            required_error: 'Shop name required',
        }),
        shop_description: z.string({
            required_error: 'Shop Price required',
        }),
        shop_type: z.string({
            required_error: 'Shop Type required',
        }),
    }),
});

export const ShopZodValidation = {
    createShopZodSchema,
};
