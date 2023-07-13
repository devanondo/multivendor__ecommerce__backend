import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { generateProductId } from '../user/user.utils';
import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { productFilterableFields } from './product.constants';
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

// Get all Shops with paginations --> Only for the Admin & SuperAdmin
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

    const whereCondtions = filterConditions(
        searchTerm,
        productFilterableFields,
        filtersData
    );

    const total = await Product.find(whereCondtions);
    const shops = await Product.find(
        { visibility: 'public' },
        { ...whereCondtions }
    )
        .populate('shop')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: shops,
    };
};

// Get all Shops with paginations --> Only for the Admin & SuperAdmin
const getSingleProducts = async (id: string): Promise<IProduct | null> => {
    const product = await Product.findOne({ product_id: id });

    if (!product)
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not round!');

    return product;
};

// Update single product --> Admin | vendor | superadmin
const updateSingleProducts = async (
    id: string,
    updatedData: Partial<IProduct>
): Promise<IProduct | null> => {
    const product = await Product.findOneAndUpdate(
        { product_id: id },
        { updatedData },
        { new: true }
    );

    if (!product) throw new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    return product;
};

// Update single product --> Admin | vendor | superadmin
const updateProductVisibility = async (
    id: string,
    updatedData: Partial<IProduct>
): Promise<IProduct | null> => {
    const product = await Product.findOneAndUpdate(
        { product_id: id },
        { updatedData },
        { new: true }
    );

    if (!product) throw new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    return product;
};

export const ProductService = {
    createProduct,
    getProducts,
    getSingleProducts,
    updateSingleProducts,
    updateProductVisibility,
};
