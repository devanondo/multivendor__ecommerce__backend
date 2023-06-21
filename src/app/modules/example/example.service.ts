import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IExample } from './example.interface';
import { Example } from './example.model';

const createExample = async (data: IExample): Promise<IExample | null> => {
    const newExample = await Example.create(data);

    return newExample;
};

// Get all Examples
const getAllExamples = async (
    pagination: IPaginationOptions
): Promise<IGenericResponse<IExample[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const examples = await Example.find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Example.countDocuments();

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: examples,
    };
};

export const ExampleService = {
    createExample,
    getAllExamples,
};
