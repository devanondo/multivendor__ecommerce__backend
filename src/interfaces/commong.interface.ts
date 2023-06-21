import { IGenericErrorMessage } from './error.interface';

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};

export type IGenericResponse<T> = {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: T;
};
