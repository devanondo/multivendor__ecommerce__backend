import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const CategorySchema = new Schema<ICategory>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        banner_image: {
            type: String,
        },
        active_status: {
            type: Boolean,
            required: true,
            default: false,
        },
        sub_category: [
            {
                title: String,
                description: String,
                banner_image: String,
                active_status: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const Category = model<ICategory, CategoryModel>(
    'Category',
    CategorySchema
);
