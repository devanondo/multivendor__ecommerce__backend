// Generate the customer|vendor|admin custom id `userid`

import moment from 'moment';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { Shop } from '../shop/shop.model';
import { User } from './user.model';

const findLastUserId = async (role: string): Promise<string | undefined> => {
    const lastUser = await User.findOne({ role: role }, { userid: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

    return lastUser?.userid ? lastUser.userid.substring(7) : undefined;
};

const findLastShopId = async (): Promise<string | undefined> => {
    const lastShop = await Shop.findOne({}, { shop_id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

    return lastShop?.shop_id ? lastShop.shop_id.substring(7) : undefined;
};

const findLastProductId = async (): Promise<string | undefined> => {
    const lastShop = await Product.findOne({}, { product_id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

    return lastShop?.product_id ? lastShop.product_id.substring(12) : undefined;
};

const findLastOrderId = async (): Promise<string | undefined> => {
    const lastOrder = await Order.findOne({}, { order_id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

    return lastOrder?.order_id ? lastOrder.order_id.substring(16) : undefined;
};

// CUS0Y23000001
export const generateUserId = async (
    role: string,
    prefix: string
): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const year = currentYear.toString().substring(2);

    const currentId =
        (await findLastUserId(role)) || (0).toString().padStart(6, '0');

    let incrementedId = (parseInt(currentId) + 1).toString().padStart(6, '0');

    incrementedId = `${prefix}0Y${year}${incrementedId}`;
    return incrementedId;
};

// PDT0Y2023CA000001
// PDCT0Y2023AR000024
export const generateProductId = async (
    prefix: string,
    category: string
): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const year = currentYear.toString();
    const cate = category.toUpperCase().substring(2, 4);

    const currentId =
        (await findLastProductId()) || (0).toString().padStart(8, '0');

    let incrementedId = (parseInt(currentId) + 1).toString().padStart(8, '0');

    incrementedId = `${prefix}0Y${year}${cate}${incrementedId}`;
    return incrementedId;
};

// SHO0Y23000001
export const generateShopId = async (prefix: string): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const year = currentYear.toString().substring(2);

    const currentId =
        (await findLastShopId()) || (0).toString().padStart(6, '0');

    let incrementedId = (parseInt(currentId) + 1).toString().padStart(6, '0');

    incrementedId = `${prefix}0Y${year}${incrementedId}`;
    return incrementedId;
};
// SHO0Y23000001
export const generateOrderId = async (prefix: string): Promise<string> => {
    const dateTime = moment().format('YYYYMMDDTHH');

    const currentId =
        (await findLastOrderId()) || (0).toString().padStart(8, '0');

    let incrementedId = (parseInt(currentId) + 1).toString().padStart(12, '0');

    incrementedId = `${prefix}${dateTime}${incrementedId}`;
    return incrementedId;
};
