import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
    productFilterableFields,
    productSearchableFields,
} from './product.constants';
import { IProduct } from './product.interface';
import { ProductService } from './product.service';

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
const getAllProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, productSearchableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await ProductService.getAllProducts(
            filters,
            paginationOptions
        );

        sendResponse<IProduct[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Products Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);
// Get all Products with paginations --> Only for the Admin & SuperAdmin
const getVendorProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, productSearchableFields);
        const id: string = req.params.id;

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await ProductService.getVendorProducts(
            filters,
            paginationOptions,
            id
        );

        sendResponse<IProduct[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Products Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

// Get all prducts
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

// Get Single product
const getSingleProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await ProductService.getSingleProducts(id);

        sendResponse<IProduct>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Product Retrived Successfully',
            data: result,
        });
    }
);

// Get a Shop products
const getShopProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const paginationOptions = pick(req.query, paginationQueryOptions);
        const id = req.params.id;

        const result = await ProductService.getShopProducts(
            id,
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

// Update Single product
const updateSingleProducts: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await ProductService.updateSingleProducts(id, payload);

        sendResponse<IProduct>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Product Updated Successfully',
            data: result,
        });
    }
);

const updateProductVisibility: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const { visibility } = req.body;

        const result = await ProductService.updateProductVisibility(
            id,
            visibility
        );

        sendResponse<IProduct>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Product Updated Successfully',
            data: result,
        });
    }
);

export const ProductController = {
    createProduct,
    getAllProducts,
    getProducts,
    getSingleProducts,
    getShopProducts,
    updateSingleProducts,
    updateProductVisibility,
    getVendorProducts,
};
