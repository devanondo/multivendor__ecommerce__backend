export const visibility = ['public', 'private', 'protected', 'restricted'];

export const productFilterableFields = [
    'searchTerm',
    'name',
    'product_id',
    'price',
    'stocked',
    'category',
    'sub_category',
    'rating',
    'shop.shop_name',
];

export const productFilterEndpoints = [
    {
        $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: '_id',
            as: 'shop',
        },
    },
    {
        $unwind: '$shop',
    },
    {
        $match: {
            $and: [
                { visibility: 'public' },
                { 'shop.active_status': 'public' },
            ],
        },
    },
];
export const allProductFilterEndpoints = [
    {
        $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: '_id',
            as: 'shop',
        },
    },
    {
        $unwind: '$shop',
    },
];
