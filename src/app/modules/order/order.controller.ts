import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import catchAsync from '../../../shared/catchAsync';
import { paginationQueryOptions } from '../../../shared/paginationOptions';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { orderSearchableFields } from './order.constants';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';
// Create order
const createOrder: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const order = req.body;
        const result = await OrderService.createOrder(order);

        sendResponse<Partial<IOrder>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Order Placed',
            data: result,
        });
    }
);

// Get all orders by --> Admin | superadmin
const getOrders: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, orderSearchableFields);

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await OrderService.getOrders(filters, paginationOptions);

        sendResponse<IGenericResponse<IOrder[]>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Order Rertrived Successfully',
            data: result,
        });
    }
);

// Get a Shop order
const getSingleOrder: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const order_id = req.params.id;

        const result = await OrderService.getSingleOrder(order_id);

        sendResponse<Partial<IOrder>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Order Rertrived Successfully',
            data: result,
        });
    }
);

// Get Orders for a customer
const getCustomerOrders: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const customer_id = req.params.id;

        const paginationOptions = pick(req.query, paginationQueryOptions);

        const result = await OrderService.getCustomerOrders(
            customer_id,
            paginationOptions
        );

        sendResponse<IGenericResponse<IOrder[]>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Order Rertrived Successfully',
            data: result,
        });
    }
);

// Get a Shop order
const getAShopOrders: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const shop_id = req.params.id;

        const result = await OrderService.getAShopOrders(shop_id);

        sendResponse<Partial<IOrder>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Order Rertrived Successfully',
            data: result,
        });
    }
);

export const OrderController = {
    createOrder,
    getOrders,
    getSingleOrder,
    getCustomerOrders,
    getAShopOrders,
};
