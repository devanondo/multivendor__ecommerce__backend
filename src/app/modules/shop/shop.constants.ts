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
            foreignField: 'userid',
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
        $lookup: {
            from: 'reviews',
            localField: 'shop_review',
            foreignField: '_id',
            as: 'shop_review',
        },
    },
    {
        $unwind: { path: '$shop_review', preserveNullAndEmptyArrays: true },
    },
    {
        $lookup: {
            from: 'users', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'shop_review.author',
            foreignField: 'userid',
            as: 'shop_review.author',
        },
    },
    {
        $unwind: {
            path: '$shop_review.author',
            preserveNullAndEmptyArrays: true,
        },
        // Unwind the "reviews.author" array
    },
    {
        $lookup: {
            from: 'customers', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'shop_review.author.customer',
            foreignField: '_id',
            as: 'shop_review.author.userDetails',
        },
    },
    {
        $unwind: {
            path: '$shop_review.author.userDetails',
            preserveNullAndEmptyArrays: true,
        }, // Unwind the "reviews.author" array
    },

    {
        $group: {
            _id: '$_id',
            shop_name: { $first: '$shop_name' },
            shop_id: { $first: '$shop_id' },
            shop_description: { $first: '$shop_description' },
            shop_type: { $first: '$shop_type' },
            shop_logo: { $first: '$shop_logo' },
            shop_banner: { $first: '$shop_banner' },
            active_status: { $first: '$active_status' },
            shop_rating: { $first: '$shop_rating' },
            shop_review: { $push: '$shop_review' },
            shop_owner: { $first: '$shop_owner' },
            createdAt: { $first: '$createdAt' },
        },
    },
    {
        $project: {
            'shop_review.author.password': 0,
        },
    },
];
// export const shopFilterEndpoints = [
//     {
//         $lookup: {
//             from: 'users',
//             localField: 'shop_owner',
//             foreignField: 'userid',
//             as: 'shop_owner',
//         },
//     },
//     {
//         $unwind: '$shop_owner',
//     },
//     {
//         $lookup: {
//             from: 'vendors',
//             localField: 'shop_owner.vendor',
//             foreignField: '_id',
//             as: 'shop_owner.userDetails',
//         },
//     },
//     {
//         $unwind: '$shop_owner.userDetails',
//     },
//     {
//         $lookup: {
//             from: 'reviews',
//             localField: 'shop_review',
//             foreignField: '_id',
//             as: 'shop_review',
//         },
//     },
//     {
//         $project: {
//             'shop_owner.password': 0,
//         },
//     },
// ];
