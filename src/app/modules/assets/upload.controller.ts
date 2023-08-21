import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IImage } from '../../../interfaces/commong.interface';
import httpStatus from 'http-status';
import { UploadService } from './upload.service';

const uploadImages: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const image = req.body.image;
        const path = req.body.path;

        const result = await UploadService.uploadImages(image, path);

        sendResponse<IImage[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Upload successfully!',
            data: result,
        });
    }
);
const deleteImages: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const images = req.body;

        const result = await UploadService.deleteImages(images);

        sendResponse<IImage[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Deleted successfully!',
            data: result,
        });
    }
);

export const UploadController = {
    uploadImages,
    deleteImages,
};
