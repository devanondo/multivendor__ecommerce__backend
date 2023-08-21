import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../error/ApiError';
import { uploadImage } from '../../../helpers/imageUploader';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { ICagegoryFilter, ICategory, ISubCategory } from './category.interface';
import { Category } from './category.model';
import { filterConditions } from '../../../helpers/filterHealper';
import {
    categoryFilterableFilelds,
    singleCategoryQuery,
} from './category.constant';

// Create Category
const createCategory = async (
    category: ICategory
): Promise<ICategory | null> => {
    const images = JSON.parse(category.banner_image as unknown as string);

    const bannerImagePromises = images.map(async (image: string) => {
        const img = await uploadImage('ecom/category', image);
        return img;
    });

    const bannerImages = await Promise.all(bannerImagePromises);

    category.banner_image = bannerImages;

    const newCategory = await Category.create(category);

    if (!newCategory)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to Create!');

    return newCategory;
};

// Get category
const getCategory = async (
    filters: ICagegoryFilter,
    pagination: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = filterConditions(
        searchTerm,
        categoryFilterableFilelds,
        filtersData
    );

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const category = await Category.find(
        whereConditions,
        { vendor: 0, admin: 0 },
        { createdAt: -1 }
    )
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    return {
        meta: {
            page,
            limit,
            total: category.length,
        },
        data: category,
    };
};

// Get Single Category
const getSingleCategory = async (id: string): Promise<ICategory | null> => {
    const category = await Category.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        ...singleCategoryQuery,
    ]);

    if (!category)
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not Found!');

    return category[0];
};

// Add sub Category
const addSubCategory = async (
    id: string,
    payload: ISubCategory
): Promise<ICategory | null> => {
    const img = await uploadImage(
        'ecom/category/sub_category',
        payload.banner_image
    );

    payload.banner_image = img;

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
            $push: {
                sub_category: [payload],
            },
        },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to create!');

    return updatedCategory;
};

// Approve | Suspend Category status by --> Super Admin & Admin
const changeCategoryStatus = async (
    id: string,
    status: string | undefined
): Promise<ICategory | null> => {
    const category = await Category.findById(id, { active_status: 1 }).lean();

    if (!category)
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found!');

    const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        { $set: { active_status: status || 'pending' } },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to approve!');

    return updatedCategory;
};

// Approve | Suspend Sub Category status by --> Super Admin & Admin
const changeSubCategoryStatus = async (
    id: string,
    status: string
): Promise<ICategory | null> => {
    // const category = await Category.aggregate([
    //     { $unwind: '$sub_category' },
    //     { $match: { 'sub_category._id': new mongoose.Types.ObjectId(id) } },
    //     {
    //         $project: {
    //             active_status: '$sub_category.active_status',
    //         },
    //     },
    // ]);

    // if (!category)
    //     throw new ApiError(httpStatus.NOT_FOUND, 'Category not found!');

    // const status = !category[0]?.active_status;

    const updatedCategory = await Category.findOneAndUpdate(
        { 'sub_category._id': id },
        { $set: { 'sub_category.$.active_status': status } },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to approve!');

    return updatedCategory;
};

//Update category --> It will implement after the create product
const updateCategory = async (
    id: string,
    category: ICategory
): Promise<ICategory | null> => {
    const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        { $set: category },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    return updatedCategory;
};
//Update sub category --> It will implement after the create product
//Update delete category --> It will implement after the create product
//Update delete sub category --> It will implement after the create product

export const CategoryService = {
    createCategory,
    getCategory,
    getSingleCategory,
    addSubCategory,
    changeCategoryStatus,
    changeSubCategoryStatus,
    updateCategory,
};
