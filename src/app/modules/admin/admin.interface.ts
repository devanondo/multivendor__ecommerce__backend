import { Model } from 'mongoose';

export type IAdmin = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
