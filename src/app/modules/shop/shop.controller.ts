import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { shopFilterableFields } from './shop.constants';
import { IShop } from './shop.interface';
import { ShopService } from './shop.service';

// Create Shop | Only can create by Vendor
const createShop: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const shop = req.body;
        if (!shop.shop_owner) {
            shop.shop_owner = req?.user?.userid;
        }

        const result = await ShopService.createShop(shop);

        sendResponse<IShop>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shop create success',
            data: result,
        });
    }
);

// Get all Shops with paginations --> Only for the Admin & SuperAdmin
const getShops: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, shopFilterableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await ShopService.getShops(filters, paginationOptions);

        sendResponse<IShop[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shops Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);
// Get all Shops with paginations --> Only for the Vendor
const getVendorShops: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req?.user?.userid;

        const result = await ShopService.getVendorShops(id);

        sendResponse<IShop[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shops Retrived Successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

// Get all a Shop with products
const getSingleShop: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await ShopService.getSingleShops(id);

        sendResponse<IShop>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shop Retrived Successfully',
            data: result,
        });
    }
);

// Update Shop active_status --> Only for the Admin & SuperAdmin
const updateSingleShop: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body;

        const result = await ShopService.updateSingleShop(id, payload);

        sendResponse<IShop>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shop Update Successfully',
            data: result,
        });
    }
);

// Get vendor shop
const getVendorShop: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const result = await ShopService.getVendorShop(id);

        sendResponse<Partial<IShop[]>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Shop retived Successfully',
            data: result,
        });
    }
);

export const ShopController = {
    createShop,
    getShops,
    getSingleShop,
    updateSingleShop,
    getVendorShop,
    getVendorShops,
};
