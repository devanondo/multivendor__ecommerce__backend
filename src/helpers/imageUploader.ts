/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import ApiError from '../error/ApiError';
import httpStatus from 'http-status';

export const uploadImage = async (folder: string, photo: any) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: folder || 'multiecom/users',
        width: 600,
        crop: 'scale',
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(photo, options);
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Cloudinary Error');
    }
};
