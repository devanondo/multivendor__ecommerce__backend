export const user_roles = ['super_admin', 'admin', 'vendor', 'customer'];

export const userSearchableFields = ['searchTerm', 'userid', 'phone', 'role'];

export const userFilterableFields = [
    'searchTerm',
    'userid',
    'phone',
    'role',
    'userDetails.email',
    'userDetails.address',
    'userDetails.name.first_name',
    'userDetails.name.last_name',
];

export const userFilterEndpoints = [
    {
        $lookup: {
            from: 'admins',
            localField: 'admin',
            foreignField: '_id',
            as: 'adminData',
        },
    },
    {
        $lookup: {
            from: 'vendors',
            localField: 'vendor',
            foreignField: '_id',
            as: 'vendorData',
        },
    },
    {
        $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customerData',
        },
    },
    {
        $project: {
            _id: 1,
            userid: 1,
            role: 1,
            phone: 1,
            createdAt: 1,
            userDetails: {
                $arrayElemAt: [
                    {
                        $concatArrays: [
                            '$adminData',
                            '$vendorData',
                            '$customerData',
                        ],
                    },
                    0,
                ],
            },
        },
    },
];
