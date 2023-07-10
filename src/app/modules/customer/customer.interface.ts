import { Model } from 'mongoose';

export type ICustomer = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: string;
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;
