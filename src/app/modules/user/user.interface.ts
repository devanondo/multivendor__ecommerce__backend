/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
    userid: string;
    role: 'super_admin' | 'admin' | 'vendor' | 'customer';
    phone: string;
    password: string;
    customer?: Types.ObjectId;
    vendor?: Types.ObjectId;
    admin?: Types.ObjectId;
    super_admin?: Types.ObjectId;
    name?: {
        first_name?: string;
        last_name?: string;
    };
};

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
    isUserExist(
        key: string
    ): Promise<Pick<IUser, 'userid' | 'password' | 'role'>>;
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
