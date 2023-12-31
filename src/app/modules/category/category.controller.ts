import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ICategory } from './category.interface';
import { CategoryService } from './categroy.service';
import { categoryFilterableFilelds } from './category.constant';

// Create Category
const createCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const category = req.body;
        category.sub_category = JSON.parse(category.sub_category);

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
        const filters = pick(req.query, categoryFilterableFilelds);

        const result = await CategoryService.getCategory(
            filters,
            paginationOptions
        );

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
        const sub_category = req.body;

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
const changeCategoryStatus: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const status = req.query.status as string;

        const result = await CategoryService.changeCategoryStatus(id, status);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category Updated',
            data: result,
        });
    }
);

// Approve | Suspend Sub Category status
const changeSubCategoryStatus: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const status = req.query.sub_status as string;

        const result = await CategoryService.changeSubCategoryStatus(
            id,
            status
        );

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Sub Category Updated',
            data: result,
        });
    }
);

const updateCategory: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await CategoryService.updateCategory(id, req.body);

        sendResponse<ICategory>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Sub Category Updated',
            data: result,
        });
    }
);

export const CategoryController = {
    createCategory,
    getCategory,
    getSingleCategory,
    addSubCategory,
    changeCategoryStatus,
    changeSubCategoryStatus,
    updateCategory,
};
