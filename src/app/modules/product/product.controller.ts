import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { IProduct } from './product.interface';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { productFilterableFields } from './product.constants';
import { paginationQueryOptions } from '../../../shared/paginationOptions';

// Create Product --> admin | vendor
const createProduct: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const product = req.body;

        const result = await ProductService.createProduct(product);

        sendResponse<IProduct>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Product Created Successfully',
            data: result,
        });
    }
);

// Get all Products with paginations --> Only for the Admin & SuperAdmin
const getProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, productFilterableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await ProductService.getProducts(
            filters,
            paginationOptions
        );

        sendResponse<IProduct[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Product Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

export const ProductController = {
    createProduct,
    getProducts,
};
