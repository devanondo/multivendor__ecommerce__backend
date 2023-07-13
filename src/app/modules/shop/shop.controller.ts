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
        shop.shop_owner = req?.user?._id;

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

export const ShopController = {
    createShop,
    getShops,
};
