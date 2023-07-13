export const shopFilterableFields = [
    'searchTerm',
    'shop_name',
    'shop_id',
    'shop_type',
    'active_status',
    'shop_rating',
    'shop_owner.userid',
];

export const shopFilterEndpoints = [
    {
        $lookup: {
            from: 'users',
            localField: 'shop_owner',
            foreignField: '_id',
            as: 'shop_owner',
        },
    },
    {
        $unwind: '$shop_owner',
    },
    {
        $lookup: {
            from: 'vendors',
            localField: 'shop_owner.vendor',
            foreignField: '_id',
            as: 'shop_owner.userDetails',
        },
    },
    {
        $unwind: '$shop_owner.userDetails',
    },
    {
        $project: {
            'shop_owner.password': 0,
        },
    },
];
