import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../error/ApiError';
import { jwtHealers } from '../helpers/jwtHealper';
import { Secret } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../shared/catchAsync';

export const auth = (...roles: string[]): RequestHandler =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // Get token form header

        const token = req.headers.authorization;
        if (!token) {
            next(
                new ApiError(httpStatus.UNAUTHORIZED, 'Authorization Invalid')
            );
        }

        // Decode token
        const decodedData = jwtHealers.verifyToken(
            token as string,
            config.jwt.secret as Secret
        );

        if (!decodedData) {
            next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
        }

        req.user = decodedData;

        if (roles.length && !roles.includes(decodedData.role))
            return next(new ApiError(httpStatus.FORBIDDEN, 'Access Denied'));

        next();
    });
