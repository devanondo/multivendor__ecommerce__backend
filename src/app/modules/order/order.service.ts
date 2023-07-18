import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { Shop } from '../shop/shop.model';
import { generateOrderId } from '../user/user.utils';
import { IOrder, IOrderFilter } from './order.interface';
import { Product } from '../product/product.model';
import { Order } from './order.model';
import mongoose, { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { filterConditions } from '../../../helpers/filterHealper';
import {
    orderFilterableFields,
    shopOrderFilterEndpoints,
} from './order.constants';

const createOrder = async (
    payload: Partial<IOrder>
): Promise<Partial<IOrder | null>> => {
    const { order_items } = payload;
    let newOrder = null;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Generate custom order i
        const orderId = await generateOrderId('ORDER');

        if (order_items && Array.isArray(order_items)) {
            for (const order_item of order_items) {
                const { shop_id, products } = order_item;

                const shop = await Shop.findOne({ shop_id }).session(session);
                if (!shop) {
                    throw new Error(`Shop with ID ${shop_id} not found`);
                }

                for (const productInfo of products) {
                    const { product_id, product_quantity } = productInfo;
                    const product = await Product.findOne({
                        product_id,
                    }).session(session);

                    if (!product)
                        throw new ApiError(
                            httpStatus.NOT_FOUND,
                            `Product with ID ${product_id} not found`
                        );

                    const stocked = (product.stocked -= product_quantity);
                    if (stocked < 0)
                        throw new ApiError(
                            httpStatus.FORBIDDEN,
                            `Less quantity of product ${product.stocked}`
                        );
                    product.sold += product_quantity;

                    await product.save();
                }
            }
        }
        payload.order_id = orderId;
        const order = await Order.create([payload], { session });

        if (!order)
            throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Order');

        newOrder = order;
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    return newOrder[0];
};

// Get all orders by --> Admin | superadmin
const getOrders = async (
    filters: IOrderFilter,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = filterConditions(
        searchTerm,
        orderFilterableFields,
        filtersData
    );

    const total = await Order.find(whereConditions);
    const order = await Order.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: order,
    };
};

// Get single order
const getSingleOrder = async (id: string): Promise<Partial<IOrder>> => {
    const order = await Order.findOne({ order_id: id }).lean();

    if (!order)
        throw new ApiError(httpStatus.NOT_FOUND, `Order ${id} not found`);

    return order;
};

// Get Orders for a customer
const getCustomerOrders = async (
    id: string,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const total = await Order.find({ customer_id: id });
    const order = await Order.find({ customer_id: id })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: order,
    };
};

// Get a Shop order
const getAShopOrders = async (id: string): Promise<Partial<IOrder>> => {
    const order = await Order.aggregate([
        {
            $match: {
                'order_items.shop_id': id,
            },
        },
        ...shopOrderFilterEndpoints,
        {
            $match: {
                _id: id,
            },
        },
    ]);

    return order[0];
};

export const OrderService = {
    createOrder,
    getOrders,
    getSingleOrder,
    getCustomerOrders,
    getAShopOrders,
};
