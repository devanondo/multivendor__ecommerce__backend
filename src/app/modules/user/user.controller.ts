import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user.service';
import { IUser } from './user.interface';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.body;
        const result = await UserService.createUser(user);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Created Successfully',
            data: result,
        });
    }
);

export const UserController = {
    createUser,
};
