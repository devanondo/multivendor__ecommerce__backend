import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../error/ApiError';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { IReviews } from './review.interface';
import { Review } from './review.model';

const createReview = async (review: IReviews): Promise<IReviews | null> => {
    const { product_id } = review;

    // const session = await mongoose.startSession();
    // let newReviewData: IReviews | null = null;

    // try {
    //     session.startTransaction();

    //     // Upload images in cloudinary

    //     const newReview = await Review.create(review);

    //     const product = await Product.findOne({ product_id }).populate({
    //         path: 'reviews',
    //         model: 'Review',
    //     });

    //     if (!product)
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Product not found!');

    //     const shop = await Shop.findOne({ shop_id: product.shop }).populate({
    //         path: 'shop_review',
    //         model: 'Review',
    //     });

    //     if (!shop) throw new ApiError(httpStatus.NOT_FOUND, 'shop not found!');

    //     if (!product.reviews) {
    //         product.reviews = [];
    //     }
    //     if (!shop.shop_review) {
    //         shop.shop_review = [];
    //     }

    //     let average = review?.rating || 0;

    //     if (product?.reviews?.length) {
    //         product.reviews.map(
    //             (rev: IReviews): void => (average += rev?.rating)
    //         );
    //     }

    //     let shopAveRating = review?.rating || 0;

    //     if (shop?.shop_review?.length) {
    //         shop.shop_review.map(
    //             (rev: IReviews) => (shopAveRating += rev?.rating)
    //         );
    //     }

    //     product.reviews.push(newReview?._id);
    //     shop.shop_review.push(newReview?._id);

    //     product.rating = average / (product.reviews.length || 1);
    //     shop.shop_rating = shopAveRating / (shop.shop_review.length || 1);

    //     await product?.save();
    //     await shop?.save();

    //     await session.commitTransaction();
    //     await session.endSession();

    //     newReviewData = newReview;
    // } catch (error) {
    //     await session.abortTransaction();
    //     await session.endSession();
    //     throw error;
    // }

    // return newReviewData;

    const session = await mongoose.startSession();
    let newReviewData: IReviews | null = null;

    try {
        session.startTransaction();

        // Upload images in cloudinary

        const newReview = await Review.create(review);

        const product = await Product.findOne({ product_id });

        if (!product) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Product not found!');
        }

        const shop = await Shop.findOne({ shop_id: product.shop });

        if (!shop) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found!');
        }

        const averageResult = await Review.aggregate([
            {
                $match: {
                    _id: { $in: product.reviews.concat(newReview._id) },
                },
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' },
                },
            },
        ]);

        const shopAverageResult = await Review.aggregate([
            {
                $match: {
                    _id: { $in: shop.shop_review.concat(newReview._id) },
                },
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' },
                },
            },
        ]);

        const average = averageResult[0]?.average || 0;
        const shopAveRating = shopAverageResult[0]?.average || 0;

        product.reviews.push(newReview._id);
        shop.shop_review.push(newReview._id);

        product.rating = Number(parseFloat(average).toFixed(1));
        shop.shop_rating = Number(parseFloat(shopAveRating).toFixed(1));

        await product?.save();
        await shop?.save();

        await session.commitTransaction();
        await session.endSession();

        newReviewData = newReview;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    return newReviewData;
};

export const ReviewService = {
    createReview,
};
