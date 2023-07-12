import { z } from 'zod';

const createCategoryZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is Required!',
        }),
        description: z.string({
            required_error: 'Description is Required!',
        }),
        banner_image: z.string({
            required_error: 'Image is Required!',
        }),
        sub_category: z.array(
            z.object({
                title: z.string().optional(),
                description: z.string().optional(),
                banner_image: z.string().optional(),
            })
        ),
    }),
});
const createSubCategoryZodSchema = z.object({
    body: z.object({
        sub_category: z.array(
            z.object({
                title: z.string(),
                description: z.string(),
                banner_image: z.string(),
            })
        ),
    }),
});

export const CategroyZodValidation = {
    createCategoryZodSchema,
    createSubCategoryZodSchema,
};
