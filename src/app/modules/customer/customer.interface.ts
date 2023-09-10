import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';
import { IProduct } from '../product/product.interface';

export type IAddress = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    holding_no: string;
    street: string;
    area: string;
    district: string;
    country: string;
    zip: string;
};

export type IAddresses = {
    status?: 'active' | 'inactive';
    address: IAddress;
    _id?: Types.ObjectId;
};

export type ICustomer = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: IImage;
    wishlist?: Partial<IProduct>[];
    addresses?: IAddresses[];
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;
