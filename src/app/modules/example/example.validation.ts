import { z } from 'zod';

const createExampleZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'role is required',
        }),
        password: z.string({
            required_error: 'password is required',
        }),
        email: z
            .string({
                required_error: 'email is required',
            })
            .email(),
    }),
});

export const ExampleValidation = {
    createExampleZodSchema,
};
