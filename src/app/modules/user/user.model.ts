import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { userFilterEndpoints, user_roles } from './user.constants';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
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

UserSchema.statics.isUserExist = async function (
    query: string
): Promise<IUser | null> {
    const user = await User.aggregate([
        ...userFilterEndpoints,
        {
            $match: {
                $or: [
                    { userid: query },
                    { phone: query },
                    { 'userDetails.email': query },
                ],
            },
        },
    ]);

    // return await User.findOne({ query }, { userid: 1, password: 1, role: 1 });
    return user[0];
};

UserSchema.statics.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
    // hashing user password
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bycrypt_salt_rounds)
    );

    next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
