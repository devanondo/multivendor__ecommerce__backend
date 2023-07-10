import { Model } from 'mongoose';

export type IVendor = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: string;
    business_name?: string;
    business_phone?: string;
    business_email?: string;
    business_address?: string;
    bank_account?: {
        bank_name?: string;
        account_no?: string;
        account_name?: string;
    };
};

export type VendorModel = Model<IVendor, Record<string, unknown>>;
