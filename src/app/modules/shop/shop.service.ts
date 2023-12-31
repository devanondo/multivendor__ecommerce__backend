import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../error/ApiError';
import { filterConditions } from '../../../helpers/filterHealper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { generateShopId } from '../user/user.utils';
import { shopFilterEndpoints, shopFilterableFields } from './shop.constants';
import { IShop, IShopFilter } from './shop.interface';
import { Shop } from './shop.model';

const createShop = async (shop: Partial<IShop>): Promise<IShop | null> => {
    const shopid = await generateShopId('SHO');
    if (!shopid)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Shop');

    shop.shop_id = shopid;

    const newShopData = await Shop.create(shop);

    if (!newShopData)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Shop');

    return newShopData;
};

// Get all Shops with paginations --> Only for the Admin & SuperAdmin
const getShops = async (
    filters: IShopFilter,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IShop[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = filterConditions(
        searchTerm,
        shopFilterableFields,
        filtersData
    );

    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const total = await Shop.aggregate([
        ...shopFilterEndpoints,
        {
            $match: whereConditions,
        },
    ]);

    const shops = await Shop.aggregate([
        ...shopFilterEndpoints,
        {
            $match: whereConditions,
        },
        {
            $sort: {
                [sortBy]: sortValue,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: shops,
    };
};
const getVendorShops = async (
    id: string
): Promise<IGenericResponse<IShop[]>> => {
    const shops = await Shop.aggregate([
        {
            $match: { shop_owner: id },
        },
        ...shopFilterEndpoints,
    ]);

    return {
        meta: {
            page: 1,
            limit: shops.length,
            total: shops.length,
        },
        data: shops,
    };
};

// Get single shop with products
const getSingleShops = async (id: string): Promise<IShop> => {
    const shop = await Shop.aggregate([
        {
            $match: {
                shop_id: id,
            },
        },
        ...shopFilterEndpoints,
    ]);

    if (!shop.length)
        throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found!');

    return shop[0];
};

// Update Shop & shop active_status --> by admin | superadmin
const updateSingleShop = async (
    id: string,
    updateShop: Partial<IShop>
): Promise<IShop | null> => {
    const newShopData = await Shop.findOneAndUpdate(
        { shop_id: id },
        updateShop,
        { new: true }
    );

    if (!newShopData)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to Update Shop');

    return newShopData;
};

// Get vendor shops
const getVendorShop = async (id: string): Promise<Partial<IShop[] | null>> => {
    const shops = await Shop.find(
        { shop_owner: id, active_status: 'public' },
        { shop_name: 1 }
    );

    return shops;
};

export const ShopService = {
    createShop,
    getShops,
    getSingleShops,
    updateSingleShop,
    getVendorShop,
    getVendorShops,
};
