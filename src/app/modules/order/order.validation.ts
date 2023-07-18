import { z } from 'zod';

const createOrderZodSchema = z.object({
    body: z
        .object({
            customer_id: z.string({
                required_error: 'Customer is required',
            }),
            shipping_address: z.string({
                required_error: 'Shipping Address is required',
            }),
            total_price: z.number({
                required_error: 'Total Price is required',
            }),
            payment_method: z.string({
                required_error: 'Payment method is required',
            }),
            billing_address: z.string().optional(),
            notes: z.string().optional(),
            order_items: z.array(
                z.object({
                    product_id: z.string({
                        required_error: 'Product is required',
                    }),
                    product_quantity: z.number({
                        required_error: 'Quantity is required',
                    }),
                    discount: z.number().optional(),
                    price: z.number({
                        required_error: 'Price is required',
                    }),
                })
            ),
        })
        .strict(),
});

export const OrderZodValidation = {
    createOrderZodSchema,
};
