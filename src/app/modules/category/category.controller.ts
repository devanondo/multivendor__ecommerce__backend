import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ICategory } from './category.interface';
import { CategoryService } from './categroy.service';

// Create Category
const createCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const category = req.body;
        const result = await CategoryService.createCategory(category);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Created Successfully',
            data: result,
        });
    }
);

// Get category
const getCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await CategoryService.getCategory(paginationOptions);

        sendResponse<ICategory[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

// Get Single Category
const getSingleCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await CategoryService.getSingleCategory(id);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Retrived Successfully',
            data: result,
        });
    }
);

// Add sub Category
const addSubCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const { sub_category } = req.body;

        const result = await CategoryService.addSubCategory(id, sub_category);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category added Successfully',
            data: result,
        });
    }
);

// Approve | Suspend Category status
const approveCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await CategoryService.approveCategory(id);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Updated',
            data: result,
        });
    }
);

// Approve | Suspend Sub Category status
const approveSubCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await CategoryService.approveSubCategory(id);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Updated',
            data: result,
        });
    }
);

export const CategoryController = {
    createCategory,
    getCategory,
    getSingleCategory,
    addSubCategory,
    approveCategory,
    approveSubCategory,
};
