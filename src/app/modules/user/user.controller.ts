import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constants';
import { IUser } from './user.interface';
import { UserService } from './user.service';

// Create user | Register user --> customer | admin | vendor
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

// Get users --> customer | admin | vendor
const getUsers: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, userFilterableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await UserService.getUsers(filters, paginationOptions);

        sendResponse<IUser[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Users Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

// Get single user --> customer | admin | vendor
const getSingleUsers: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await UserService.getSingleUsers(id);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Retrived Successfully',
            data: result,
        });
    }
);

// Update user info --> customer | admin | vendor
const updateUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const updateData = req.body;

        const result = await UserService.updateUser(id, updateData);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User updated Successfully',
            data: result,
        });
    }
);

export const UserController = {
    createUser,
    updateUser,
    getSingleUsers,
    getUsers,
};
