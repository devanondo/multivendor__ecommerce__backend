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

// Request to create order
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
                    product.total_sold_price +=
                        product_quantity * product.price;

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

// Request to cancle order
const requestToCancleOrder = async (
    order_id: string
): Promise<IOrder | null> => {
    // Need Validate with user_id with order user id is matched

    const filter = { order_id };
    const update = {
        $set: {
            order_status: 'req_cancel',
            'order_items.$[].products.$[product].order_status': 'req_cancel',
        },
    };
    const arrayFilters = [{ 'product.order_status': { $ne: 'req_cancel' } }];

    const options = {
        new: true, // Return the updated document
        arrayFilters,
    };

    const updatedOrder = await Order.findOneAndUpdate(filter, update, options);

    if (!updatedOrder)
        throw new ApiError(httpStatus.FORBIDDEN, 'Requst UnSuccessfull');

    // Send notification to admin and superadmin and shop

    return updatedOrder;
};

// Accept cancel req by admin | superadmin
const acceptCancelRequest = async (
    order_id: string
): Promise<IOrder | null> => {
    let newOrder = null;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updateOrder = await Order.findOne({ order_id }).session(session);

        if (!updateOrder)
            throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');

        const { order_items } = updateOrder;

        if (order_items && Array.isArray(order_items)) {
            for (const order_item of order_items) {
                const { products } = order_item;

                // Send notification to shop order cancelled

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

                    const stocked = (product.stocked += product_quantity);
                    if (stocked < 0)
                        throw new ApiError(
                            httpStatus.FORBIDDEN,
                            `Less quantity of product ${product.stocked}`
                        );
                    product.sold -= product_quantity;

                    productInfo.order_status = 'cancelled';

                    await product.save();
                }
            }
        }

        await updateOrder.save();

        newOrder = updateOrder;

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    return newOrder;
};

// chnage spesific order_status by  shop_owner | admin | superadmin
const changeOrderProductStatus = async (
    order_id: string,
    product_id: string,
    order_status: string
): Promise<IOrder | null> => {
    const updatedOrder = await Order.findOneAndUpdate(
        {
            order_id: order_id,
            order_items: { $elemMatch: { 'products.product_id': product_id } },
        },
        {
            $set: {
                'order_items.$[outer].products.$[inner].order_status':
                    order_status,
            },
        },
        {
            arrayFilters: [
                { 'outer.products.product_id': product_id },
                { 'inner.product_id': product_id },
            ],
            new: true, // This option returns the updated document
        }
    );

    return updatedOrder;
};

// chnage spesific order_status by  admin | superadmin
const changeStatus = async (
    order_id: string,
    order_status: string
): Promise<IOrder | null> => {
    const order = await Order.findOne({ order_id });

    if (!order)
        throw new ApiError(httpStatus.NOT_FOUND, `Order not found ${order_id}`);

    if (order.order_status == 'cancelled')
        throw new ApiError(
            httpStatus.NOT_FOUND,
            `Order already cancelled ${order_id}`
        );

    if (order_status === 'shipped' || order_status === 'delivered') {
        // Check if all products in the order have an order_status of 'delivered'
        const allProductsDelivered = order.order_items.every((item) =>
            item.products.every(
                (product) => product.order_status === 'delivered'
            )
        );

        // Allow changing the order_status only if all products are delivered
        if (!allProductsDelivered)
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Cannot change order status because not all products are delivered.'
            );

        // Update the order_status
        order.order_status = order_status;

        // Save the updated order
        const updatedOrder = await order.save();
        return updatedOrder;
    } else {
        const updatedOrder = await Order.findOneAndUpdate(
            { order_id },
            { order_status: order_status },
            { new: true }
        );

        if (!updatedOrder)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong');

        return updatedOrder;
    }
};

export const OrderService = {
    createOrder,
    getOrders,
    getSingleOrder,
    getCustomerOrders,
    getAShopOrders,
    requestToCancleOrder,
    acceptCancelRequest,
    changeOrderProductStatus,
    changeStatus,
};
