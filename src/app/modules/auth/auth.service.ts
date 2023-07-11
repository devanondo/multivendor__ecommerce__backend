import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import ApiError from '../../../error/ApiError';
import { jwtHealers } from '../../../helpers/jwtHealper';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { password, id } = payload;

    const isUserExist = await User.isUserExist(id);

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (
        isUserExist.password &&
        !User.isPasswordMatched(password, isUserExist?.password)
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Password');
    }

    const { role, userid } = isUserExist;

    // Generate access token
    const accessToken = jwtHealers.createToken(
        {
            userid,
            role: role,
        },
        config.jwt.secret as Secret,
        config.jwt.exprire_in as string
    );

    // Generate refresh token
    const refreshToken = jwtHealers.createToken(
        {
            userid,
            role: role,
        },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_exprire_in as string
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const AuthService = {
    loginUser,
};
