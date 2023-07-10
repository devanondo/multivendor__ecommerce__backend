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

export type UserModel = Model<IUser, Record<string, unknown>>;
