import { Model } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type ICustomer = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: IImage;
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;
