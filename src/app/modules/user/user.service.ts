import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../error/ApiError';
import { uploadImage } from '../../../helpers/imageUploader';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/commong.interface';
import { IPaginationOptions } from '../../../shared/paginationOptions';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IAddress, ICustomer } from '../customer/customer.interface';
import { Customer } from '../customer/customer.model';
import { IVendor } from '../vendor/vendor.interface';
import { Vendor } from '../vendor/vendor.model';
import { IAddresses } from './../customer/customer.interface';
import { userFilterEndpoints, userFilterableFields } from './user.constants';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';

// Create user | Register User
const createUser = async (user: IUser): Promise<IUser | null> => {
    let newUserAllData = null;
    const { name, ...userData } = user;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let createdUser = null;

        // Generate User Id `userid`
        let generatedUserId = null;

        const avatar = await uploadImage('ecom/users', user.file);

        if (!avatar) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Faild to Create!');
        }

        // Create Customer|Admin|Vendor
        if (user?.role === 'customer') {
            createdUser = await Customer.create(
                [{ name: name, profile_picture: avatar }],
                { session }
            );

            generatedUserId = await generateUserId(userData.role, 'CUS');
        } else if (user?.role === 'vendor') {
            createdUser = await Vendor.create(
                [{ name: name, profile_picture: avatar }],
                { session }
            );
            generatedUserId = await generateUserId(userData.role, 'VEN');
        } else if (user?.role === 'admin') {
            createdUser = await Admin.create(
                [{ name: name, profile_picture: avatar }],
                { session }
            );
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

//  Register Admin
const createAdmin = async (user: IUser): Promise<IUser | null> => {
    let newUserAllData = null;
    const { name, ...userData } = user;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let createdUser = null;

        // Generate User Id `userid`
        let generatedUserId = null;

        // Create Admnin
        if (user?.role === 'admin') {
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

// Get all users with filters and paginations
const getUsers = async (
    filters: IUserFilters,
    pagination: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(pagination);

    const { searchTerm, ...filtersData } = filters;

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: userFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const sortValue = sortOrder === 'ascending' || sortOrder === 'asc' ? 1 : -1;

    const filterConditions = [
        ...userFilterEndpoints,
        {
            $match: whereConditions,
        },
    ];

    const users = await User.aggregate([
        ...filterConditions,
        {
            $sort: {
                [sortBy]: sortValue,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);

    const total = await User.aggregate([...filterConditions]);

    return {
        meta: {
            page,
            limit,
            total: total.length,
        },
        data: users,
    };
};

// Get single user --> customer | admin | vendor
const getSingleUsers = async (id: string): Promise<IUser | null> => {
    const user = await User.aggregate([
        ...userFilterEndpoints,
        {
            $match: {
                userid: id,
            },
        },
    ]);

    if (!user.length)
        throw new ApiError(httpStatus.NOT_FOUND, 'User not round!');

    return user[0];
};

// Update user
const updateUser = async (
    id: string,
    payload: Partial<ICustomer | IAdmin | IVendor>
): Promise<IUser | null> => {
    const user = await User.findOne({ userid: id });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    const { name, ...customerData } = payload;
    const updateUserData: Partial<ICustomer | IAdmin | IVendor> = {
        ...customerData,
    };

    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            const nameKey = `name.${key}` as keyof Partial<ICustomer>; // `name.fisrtName`
            (updateUserData as any)[nameKey] = name[key as keyof typeof name];
        });
    }

    let result = null;

    if (user.role === 'customer') {
        result = await Customer.findByIdAndUpdate(
            { _id: user.customer },
            updateUserData,
            { new: true }
        );
    } else if (user.role === 'admin') {
        result = await Admin.findByIdAndUpdate(
            { _id: user.admin },
            updateUserData,
            { new: true }
        );
    } else if (user.role === 'vendor') {
        result = await Vendor.findByIdAndUpdate(
            { _id: user.vendor },
            updateUserData,
            { new: true }
        );
    }

    if (!result) throw new ApiError(httpStatus.FORBIDDEN, 'Faild to update!');

    const updateUser = await User.findOne({ userid: id }, { password: 0 })
        .populate('customer')
        .populate('admin')
        .populate('vendor')
        .lean();

    return updateUser;
};

// Add customer address by (customer | admin | superadmin)
const addCustomerAddress = async (
    id: string,
    payload: IAddresses
): Promise<null> => {
    const user = await User.findOne({ userid: id });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    const customer = await Customer.findOne({ _id: user.customer });
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    customer.addresses?.push(payload);

    await customer.save();

    return null;
};

// Update customer address by (customer | admin | superadmin)
const updateCustomerAddress = async (
    id: string,
    payload: {
        address_id: string;
        address: IAddress;
    }
): Promise<null> => {
    const customer = await Customer.findOne({ _id: id });
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    const isExistAddress = customer.addresses?.find(
        (cus: IAddresses) =>
            cus._id?.toString() === payload.address_id.toString()
    );

    if (!isExistAddress)
        throw new ApiError(httpStatus.NOT_FOUND, 'Address Not Found!');

    const newAddresses = customer?.addresses?.map((address) => {
        if (address._id?.toString() === payload.address_id.toString()) {
            address.address = payload.address;

            return address;
        } else {
            return address;
        }
    });

    customer.addresses = newAddresses || [];

    await customer.save();

    return null;
};

// Change customer address status by (customer | admin | superadmin)
const deleteCustomerAddress = async (
    id: string,
    payload: {
        address_id: string;
    }
): Promise<null> => {
    const customer = await Customer.findOne({ _id: id });
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    const newAddresses = customer.addresses?.filter(
        (cus: IAddresses) =>
            cus._id?.toString() !== payload.address_id.toString()
    );
    customer.addresses = newAddresses;

    await customer.save();

    return null;
};

// Change customer address status by (customer | admin | superadmin)
const updateCustomerAddressStatus = async (
    id: string,
    payload: {
        address_id: string;
    }
): Promise<null> => {
    const customer = await Customer.findOne({ _id: id });
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');

    const isExistAddress = customer.addresses?.find(
        (cus: IAddresses) =>
            cus._id?.toString() === payload.address_id.toString()
    );

    if (!isExistAddress)
        throw new ApiError(httpStatus.NOT_FOUND, 'Address Not Found!');

    const newAddresses = customer?.addresses?.map((address) => {
        if (address._id?.toString() === payload.address_id.toString()) {
            address.status = 'active';

            return address;
        } else {
            address.status = 'inactive';
            return address;
        }
    });

    customer.addresses = newAddresses || [];

    await customer.save();

    return null;
};

export const UserService = {
    createUser,
    createAdmin,
    getUsers,
    getSingleUsers,
    updateUser,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    updateCustomerAddressStatus,
};
