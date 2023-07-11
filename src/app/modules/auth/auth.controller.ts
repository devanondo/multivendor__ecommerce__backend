import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse } from './auth.interface';
import httpStatus from 'http-status';

const loginUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthService.loginUser(req.body);
        const { refreshToken, ...others } = result;

        // Set refresh token on cookie
        const options = {
            secure: config.env === 'production',
            httpOnly: true,
        };

        res.cookie('refreshToken', refreshToken, options);

        sendResponse<ILoginUserResponse>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Logged in successfully!',
            data: others,
        });
    }
);

export const AuthController = {
    loginUser,
};
