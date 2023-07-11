import { z } from 'zod';

const loginZodSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: 'ID Required!',
        }),
        password: z.string({
            required_error: 'Password Required!',
        }),
    }),
});

export const AuthZodValidation = {
    loginZodSchema,
};
