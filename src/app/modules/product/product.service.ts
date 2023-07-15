import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { generateProductId } from '../user/user.utils';
import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
    allProductFilterEndpoints,
    productFilterEndpoints,
    productFilterableFields,
} from './product.constants';
import { SortOrder } from 'mongoose';
import { filterConditions } from '../../../helpers/filterHealper';

const createProduct = async (
    product: Partial<IProduct>
): Promise<IProduct | null> => {
    const product_id = await generateProductId(
        'PDCT',
        product?.category || '_'
    );

    if (!product_id)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Product');

    product.product_id = product_id;
    // Product Logo implement later
    // Product Banner implement later

    const newProduct = await Product.create(product);

    if (!newProduct)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to create Product');

    return newProduct;
};

// Get all Products
const getProducts = async (
    filters: IProductFilter,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = filterConditions(
        searchTerm,
        productFilterableFields,
        filtersData
    );
    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const total = await Product.aggregate([
        ...productFilterEndpoints,
        { $match: whereConditions },
    ]);
    const products = await Product.aggregate([
        ...productFilterEndpoints,
        { $match: whereConditions },
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
        data: products,
    };
};

// Get all Products --> Admin | Superadmin
const getAllProducts = async (
    filters: IProductFilter,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = filterConditions(
        searchTerm,
        productFilterableFields,
        filtersData
    );
    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const total = await Product.aggregate([{ $match: whereConditions }]);
    const products = await Product.aggregate([
        ...allProductFilterEndpoints,
        { $match: whereConditions },
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
        data: products,
    };
};

// Get Single product
const getSingleProducts = async (id: string): Promise<IProduct | null> => {
    const product = await Product.findOne({ product_id: id }).populate('shop');

    if (!product)
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not round!');

    return product;
};

// Get a Shop products
const getShopProducts = async (
    shop_id: string,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const total = await Product.aggregate([
        {
            $match: { shop: shop_id },
        },
        ...productFilterEndpoints,
    ]);

    const shops = await Product.aggregate([
        {
            $match: { shop: shop_id },
        },
        ...productFilterEndpoints,
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

// Update single product --> Admin | vendor | superadmin
const updateSingleProducts = async (
    id: string,
    updatedData: Partial<IProduct>
): Promise<IProduct | null> => {
    const product = await Product.findOneAndUpdate(
        { product_id: id, visibility: 'private' },
        updatedData,
        { new: true }
    );

    if (!product) throw new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    return product;
};

// Update single product --> Admin | vendor | superadmin
const updateProductVisibility = async (
    id: string,
    visibility: string
): Promise<IProduct | null> => {
    const product = await Product.findOneAndUpdate(
        { product_id: id },
        { visibility: visibility },
        { new: true }
    );

    if (!product) throw new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    return product;
};

export const ProductService = {
    createProduct,
    getProducts,
    getAllProducts,
    getSingleProducts,
    getShopProducts,
    updateSingleProducts,
    updateProductVisibility,
};
