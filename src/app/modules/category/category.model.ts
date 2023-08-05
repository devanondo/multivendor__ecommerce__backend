import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';
import { status } from './category.constant';

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
        banner_image: [
            {
                public_id: String,
                url: String,
            },
        ],
        active_status: {
            type: String,
            enum: status,
            default: 'pending',
            required: true,
        },
        sub_category: [
            {
                title: String,
                description: String,
                banner_image: {
                    public_id: String,
                    url: String,
                },
                active_status: {
                    type: String,
                    required: true,
                    enum: status,
                    default: 'pending',
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
