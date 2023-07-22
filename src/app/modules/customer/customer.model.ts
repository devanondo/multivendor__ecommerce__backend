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
