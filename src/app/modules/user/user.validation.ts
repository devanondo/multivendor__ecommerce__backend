import { z } from 'zod';

const createUserZodSchema = z.object({
    body: z.object({
        role: z.enum(['vendor', 'customer'] as [string, ...string[]], {
            required_error: 'Role is Required!',
        }),
        password: z.string({
            required_error: 'Password is Required!',
        }),
        phone: z.string({
            required_error: 'Phone is Required!',
        }),
        first_name: z.string({
            required_error: 'First Name is Required!',
        }),
        last_name: z.string({
            required_error: 'Last Name is Required!',
        }),
    }),
});
const createAdminZodSchema = z.object({
    body: z.object({
        role: z.enum(['admin'] as [string, ...string[]], {
            required_error: 'Role is Required!',
        }),
        password: z.string({
            required_error: 'Password is Required!',
        }),
        phone: z.string({
            required_error: 'Phone is Required!',
        }),
        first_name: z.string({
            required_error: 'First Name is Required!',
        }),
        last_name: z.string({
            required_error: 'Last Name is Required!',
        }),
    }),
});

const updateUserZodSchema = z.object({
    body: z.object({
        name: z
            .object({
                first_name: z.string(),
                last_name: z.string(),
            })
            .optional(),
        address: z.string().optional(),
        profile_picture: z.string().optional(),
        business_name: z.string().optional(),
        business_address: z.string().optional(),
    }),
});

export const UserZodValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    createAdminZodSchema,
};
