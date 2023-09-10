import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constants';
import { IUser } from './user.interface';
import { UserService } from './user.service';

// Create user | Register user --> customer | vendor
const createUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const formData = req.body;
        const { first_name, last_name, ...restData } = formData;

        const userData = {
            name: {
                first_name,
                last_name,
            },
            ...restData,
        };

        const result = await UserService.createUser(userData);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Created Successfully',
            data: result,
        });
    }
);

// Create user | Register user --> customer | admin | vendor
const createAdmin: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.body;
        const result = await UserService.createAdmin(user);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Created Successfully',
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

// Add customer address by (customer | admin | superadmin)
const addCustomerAddress: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await UserService.addCustomerAddress(id, payload);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Address added Successfully',
            data: result,
        });
    }
);

// Update customer address by (customer | admin | superadmin)
const updateCustomerAddress: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await UserService.updateCustomerAddress(id, payload);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Address Updated Successfully',
            data: result,
        });
    }
);

// Delte customer address by (customer | admin | superadmin)
const deleteCustomerAddress: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await UserService.deleteCustomerAddress(id, payload);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Address Deleted Successfully',
            data: result,
        });
    }
);

// Update customer address status by (customer | admin | superadmin)
const updateCustomerAddressStatus: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await UserService.updateCustomerAddressStatus(
            id,
            payload
        );

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Address Updated Successfully',
            data: result,
        });
    }
);

export const UserController = {
    createUser,
    createAdmin,
    updateUser,
    getSingleUsers,
    getUsers,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    updateCustomerAddressStatus,
};
