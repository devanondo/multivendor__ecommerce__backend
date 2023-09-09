/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type IUser = {
    userid: string;
    role: 'super_admin' | 'admin' | 'vendor' | 'customer';
    phone: string;
    password: string;
    customer?: Types.ObjectId;
    vendor?: Types.ObjectId;
    admin?: Types.ObjectId;
    super_admin?: Types.ObjectId;

    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: IImage;

    _id?: Types.ObjectId;
    file?: string;
};

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
    isUserExist(
        key: string
    ): Promise<Pick<IUser, '_id' | 'userid' | 'password' | 'role'>>;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
    searchTerm?: string;
    userid?: string;
    email?: string;
    phone?: string;
    role?: string;
};
