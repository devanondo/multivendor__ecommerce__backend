import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error.interface';
import { IGenericErrorResponse } from '../interfaces/commong.interface';

const handleValidationError = (
    error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
        (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return { path: el?.path, message: el?.message };
        }
    );

    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMessages: errors,
    };
};

export default handleValidationError;
