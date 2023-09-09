import { z } from 'zod';
import { visibility } from '../product/product.constants';

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
        shop_email: z
            .string({
                required_error: 'Shop Email required',
            })
            .email(),
        shop_address: z.string({
            required_error: 'Shop Address required',
        }),
        shop_phone: z.string({
            required_error: 'Shop Phone required',
        }),
        shop_website: z.string().optional(),
    }),
});

const updateShopZodSchema = z.object({
    body: z
        .object({
            shop_name: z.string().optional(),
            shop_description: z.string().optional(),
            shop_type: z.string().optional(),
            active_status: z
                .enum([...visibility] as [string, ...string[]])
                .optional(),
            shop_email: z.string().email().optional(),
            shop_address: z.string().optional(),
            shop_phone: z.string().optional(),
            shop_website: z.string().optional(),
        })
        .refine((obj) => !('active_status' in obj), {
            message: "The 'active_status' is not allowed.",
            path: ['active_status'],
        }),
});

const updateShopActiveStatusZodSchema = z.object({
    body: z
        .object({
            active_status: z.enum([...visibility] as [string, ...string[]]),
        })
        .strict(),
});
export const ShopZodValidation = {
    createShopZodSchema,
    updateShopActiveStatusZodSchema,
    updateShopZodSchema,
};
