import { z } from 'zod';
import { user_roles } from './user.constants';

const createUserZodSchema = z.object({
    body: z.object({
        role: z.enum([...user_roles] as [string, ...string[]], {
            required_error: 'Role is Required!',
        }),
        password: z.string({
            required_error: 'Password is Required!',
        }),
        phone: z.string({
            required_error: 'Phone is Required!',
        }),
        name: z.object({
            first_name: z.string({
                required_error: 'First Name is Required!',
            }),
            last_name: z.string({
                required_error: 'Last Name is Required!',
            }),
        }),
    }),
});

export const UserZodValidation = {
    createUserZodSchema,
};
