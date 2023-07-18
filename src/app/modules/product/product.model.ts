import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';
import { visibility } from './product.constants';

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        product_id: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        sub_category: String,
        stocked: {
            type: Number,
            required: true,
            default: 1,
        },
        visibility: {
            type: String,
            enum: visibility,
            default: 'private',
            required: true,
        },
        product_image: [
            {
                public_id: String,
                url: String,
            },
        ],
        description: String,
        variations: [String],
        weight: Number,
        diamention: String,
        features: String,
        rating: {
            type: Number,
            default: 0,
        },
        brand: String,
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        shop: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const Product = model<IProduct, ProductModel>('Product', ProductSchema);
