import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { ICategory, ISubCategory } from './category.interface';
import { Category } from './category.model';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import mongoose from 'mongoose';

// Create Category
const createCategory = async (
    category: ICategory
): Promise<ICategory | null> => {
    const newCategory = await Category.create(category);

    if (!newCategory)
        throw new ApiError(httpStatus.FORBIDDEN, 'Faild to Create!');

    return newCategory;
};

// Get category
const getCategory = async (
    pagination: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const category = await Category.find(
        {},
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
    const category = await Category.findById(id, {
        vendor: 0,
        admin: 0,
    }).lean();

    if (!category)
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not Found!');

    return category;
};

// Add sub Category
const addSubCategory = async (
    id: string,
    payload: ISubCategory[]
): Promise<ICategory | null> => {
    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
            $push: {
                sub_category: [...payload],
            },
        },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to create!');

    return updatedCategory;
};

// Approve | Suspend Category status by --> Super Admin & Admin
const approveCategory = async (id: string): Promise<ICategory | null> => {
    const category = await Category.findById(id, { active_status: 1 }).lean();

    if (!category)
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found!');

    const status = !category?.active_status;

    const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        { $set: { active_status: status } },
        { new: true }
    );

    if (!updatedCategory)
        new ApiError(httpStatus.FORBIDDEN, 'Faild to approve!');

    return updatedCategory;
};

// Approve | Suspend Sub Category status by --> Super Admin & Admin
const approveSubCategory = async (id: string): Promise<ICategory | null> => {
    const category = await Category.aggregate([
        { $unwind: '$sub_category' },
        { $match: { 'sub_category._id': new mongoose.Types.ObjectId(id) } },
        {
            $project: {
                active_status: '$sub_category.active_status',
            },
        },
    ]);

    if (!category)
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found!');

    const status = !category[0]?.active_status;

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
//Update sub category --> It will implement after the create product
//Update delete category --> It will implement after the create product
//Update delete sub category --> It will implement after the create product

export const CategoryService = {
    createCategory,
    getCategory,
    getSingleCategory,
    addSubCategory,
    approveCategory,
    approveSubCategory,
};
