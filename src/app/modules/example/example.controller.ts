import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IExample } from './example.interface';
import { ExampleService } from './example.service';
import pick from '../../../shared/pick';
import { paginationQueryOptions } from '../../../shared/paginationOptions';

// Create a new example
const createExample: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ExampleService.createExample(req.body);

        sendResponse<IExample>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Exmaple Created Successfully',
            data: result,
        });
    }
);

// Get example
const getAllExample: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const pagination = pick(req.query, paginationQueryOptions);

        const result = await ExampleService.getAllExamples(pagination);

        sendResponse<IExample[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Example retrieved Successfully',
            data: result.data,
            meta: result.meta,
        });
    }
);

export const ExampleController = {
    createExample,
    getAllExample,
};
