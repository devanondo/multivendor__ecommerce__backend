import { Schema, model } from 'mongoose';
import { CustomerModel, ICustomer } from './customer.interface';

const CustomerSchema = new Schema<ICustomer>(
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
        wishlist: [
            {
                type: Object,
            },
        ],
        addresses: [
            {
                status: {
                    type: String,
                    enum: ['active', 'inactive'],
                    default: 'inactive',
                },
                address: {
                    first_name: String,
                    last_name: String,
                    email: String,
                    phone: String,
                    holding_no: String,
                    street: String,
                    area: String,
                    distict: String,
                    country: String,
                    zip: String,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const Customer = model<ICustomer, CustomerModel>(
    'Customer',
    CustomerSchema
);
