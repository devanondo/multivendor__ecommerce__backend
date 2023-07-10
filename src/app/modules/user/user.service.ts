import mongoose from 'mongoose';
import { IUser } from './user.interface';
import { Customer } from '../customer/customer.model';
import { Vendor } from '../vendor/vendor.model';
import { Admin } from '../admin/admin.model';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { User } from './user.model';
import { generateUserId } from './user.utils';

const createUser = async (user: IUser): Promise<IUser | null> => {
    let newUserAllData = null;
    const { name, ...userData } = user;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let createdUser = null;

        // Generate User Id `userid`
        let generatedUserId = null;

        // Create Customer|Admin|Vendor
        if (user?.role === 'customer') {
            createdUser = await Customer.create([{ name: name }], { session });

            generatedUserId = await generateUserId(userData.role, 'CUS');
        } else if (user?.role === 'vendor') {
            createdUser = await Vendor.create([{ name: name }], { session });
            generatedUserId = await generateUserId(userData.role, 'VEN');
        } else if (user?.role === 'admin') {
            createdUser = await Admin.create([{ name: name }], { session });
            generatedUserId = await generateUserId(userData.role, 'ADM');
        }

        if (!createdUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to Create!');
        }

        if (!generatedUserId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to Generate ID');
        }

        userData.userid = generatedUserId;
        userData[userData.role] = createdUser[0]._id;

        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to Create');
        }

        newUserAllData = newUser[0];

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserAllData) {
        newUserAllData = await User.findById({
            _id: newUserAllData._id,
        }).populate(newUserAllData.role);
    }

    return newUserAllData;
};

export const UserService = {
    createUser,
};
