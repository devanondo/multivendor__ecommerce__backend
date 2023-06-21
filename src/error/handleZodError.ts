import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/commong.interface';
import { IGenericErrorMessage } from '../interfaces/error.interface';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = error.issues?.map(
        (issue: ZodIssue) => {
            return {
                path: issue?.path[issue?.path?.length - 1],
                message: issue?.message,
            };
        }
    );

    return {
        statusCode: 400,
        message: 'ValidationError',
        errorMessages: errors,
    };
};

export default handleZodError;
