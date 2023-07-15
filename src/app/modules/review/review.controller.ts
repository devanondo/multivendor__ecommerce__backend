import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review..service';
import sendResponse from '../../../shared/sendResponse';
import { IReviews } from './review.interface';
import httpStatus from 'http-status';

// Create user | Register user --> customer | admin | vendor
const createReview: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.body;
        const result = await ReviewService.createReview(user);

        sendResponse<IReviews>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Review Created Successfully',
            data: result,
        });
    }
);

export const ReviewController = {
    createReview,
};
