import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';

const AdminSchema = new Schema<IAdmin>(
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

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
