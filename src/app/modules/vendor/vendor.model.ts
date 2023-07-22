import { Schema, model } from 'mongoose';
import { IVendor, VendorModel } from './vendor.interface';

const VendorSchema = new Schema<IVendor>(
    {
        email: {
            type: String,
            unique: true,
        },
        name: {
            first_name: String,
            last_name: String,
        },
        address: String,
        profile_picture: {
            public_id: String,
            url: String,
        },
        business_name: String,
        business_phone: String,
        business_email: String,
        business_address: String,
        bank_account: {
            bank_name: String,
            account_no: String,
            account_name: String,
        },
    },

    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const Vendor = model<IVendor, VendorModel>('Vendor', VendorSchema);
