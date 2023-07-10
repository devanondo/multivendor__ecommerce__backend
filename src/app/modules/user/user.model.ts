import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { user_roles } from './user.constants';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser>(
    {
        userid: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: user_roles,
        },
        phone: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: 'Vendor',
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.pre('save', async function (next) {
    // hashing user password
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bycrypt_salt_rounds)
    );

    next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
