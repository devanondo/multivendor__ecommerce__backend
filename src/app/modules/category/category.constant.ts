export const status = ['active', 'pending', 'restricted'];

export const categoryFilterableFilelds = ['searchTerm', 'active_status'];

// export const singleCategoryQuery = [
//     {
//         $lookup: {
//             from: 'products',
//             let: { categoryId: '$_id', categoryTitle: '$title' },
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {
//                             $and: [{ $eq: ['$category', '$$categoryTitle'] }],
//                         },
//                     },
//                 },
//             ],
//             as: 'products',
//         },
//     },
//     {
//         $addFields: {
//             totalSold: { $sum: '$products.sold' },
//             totalSoldPrice: { $sum: '$products.total_sold_price' },
//             reviews: {
//                 $reduce: {
//                     input: '$products.reviews',
//                     initialValue: [],
//                     in: { $setUnion: ['$$value', '$$this'] },
//                 },
//             },
//         },
//     },
//     {
//         $lookup: {
//             from: 'reviews', // Replace with the actual collection name for reviews
//             localField: 'reviews',
//             foreignField: '_id',
//             as: 'reviews',
//         },
//     },
//     {
//         $project: {
//             _id: 1,
//             title: 1,
//             description: 1,
//             banner_image: 1,
//             active_status: 1,
//             sub_category: 1,
//             createdAt: 1,
//             updatedAt: 1,
//             // products: {
//             //     $cond: {
//             //         if: { $isArray: '$products' },
//             //         then: '$products',
//             //         else: [],
//             //     },
//             // },
//             reviews: 1,
//             totalSold: 1,
//             totalSoldPrice: 1,
//         },
//     },
// ];

export const singleCategoryQuery = [
    {
        $lookup: {
            from: 'products',
            let: { categoryId: '$_id', categoryTitle: '$title' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ['$category', '$$categoryTitle'] }],
                        },
                    },
                },
            ],
            as: 'products',
        },
    },
    {
        $addFields: {
            totalSold: { $sum: '$products.sold' },
            totalSoldPrice: { $sum: '$products.total_sold_price' },
            rating: { $avg: '$products.rating' },
            reviews: {
                $reduce: {
                    input: '$products.reviews',
                    initialValue: [],
                    in: { $setUnion: ['$$value', '$$this'] },
                },
            },
        },
    },
    {
        $lookup: {
            from: 'reviews', // Replace with the actual collection name for reviews
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviews',
        },
    },

    {
        $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true },
    },
    {
        $lookup: {
            from: 'users', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'reviews.author',
            foreignField: 'userid',
            as: 'reviews.author',
        },
    },
    {
        $unwind: { path: '$reviews.author', preserveNullAndEmptyArrays: true },
        // Unwind the "reviews.author" array
    },
    {
        $lookup: {
            from: 'customers', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'reviews.author.customer',
            foreignField: '_id',
            as: 'reviews.author.userDetails',
        },
    },
    {
        $unwind: {
            path: '$reviews.author.userDetails',
            preserveNullAndEmptyArrays: true,
        }, // Unwind the "reviews.author" array
    },

    {
        $group: {
            _id: '$_id',
            title: { $first: '$title' },
            banner_image: { $first: '$banner_image' },
            description: { $first: '$description' },
            active_status: { $first: '$active_status' },
            sub_category: { $first: '$sub_category' },
            rating: { $first: '$rating' },
            reviews: { $push: '$reviews' },
            totalSold: { $first: '$totalSold' },
            totalSoldPrice: { $first: '$totalSoldPrice' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    },
];
