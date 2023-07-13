import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { IShop, IShopFilter } from './shop.interface';
import { Shop } from './shop.model';
import { generateShopId } from '../user/user.utils';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { shopFilterEndpoints, shopFilterableFields } from './shop.constants';
import { SortOrder } from 'mongoose';

const createShop = async (shop: Partial<IShop>): Promise<IShop | null> => {
    const shopid = await generateShopId('SHO');
    if (!shopid)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Shop');

    shop.shop_id = shopid;

    // Shop Logo implement later
    // Shop Banner implement later

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

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: shopFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

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

export const ShopService = {
    createShop,
    getShops,
};
