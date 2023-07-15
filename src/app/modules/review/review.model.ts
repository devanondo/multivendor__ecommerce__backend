import { Schema, model } from 'mongoose';
import { IReviews, ReviewModel } from './review.interface';

const ReviewSchema = new Schema<IReviews>(
    {
        message: {
            type: String,
            required: true,
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        rating: {
            type: Number,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        product_id: {
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

export const Review = model<IReviews, ReviewModel>('Review', ReviewSchema);
