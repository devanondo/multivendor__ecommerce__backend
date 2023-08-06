export const status = ['active', 'pending', 'restricted'];

export const categoryFilterableFilelds = ['searchTerm', 'active_status'];

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
        $project: {
            _id: 1,
            title: 1,
            description: 1,
            banner_image: 1,
            active_status: 1,
            sub_category: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            products: {
                $cond: {
                    if: { $isArray: '$products' },
                    then: '$products',
                    else: [],
                },
            },
            reviews: 1,
            totalSold: 1,
            totalSoldPrice: 1,
        },
    },
];
