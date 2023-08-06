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
    'visibility',
    'shop.shop_name',
];
export const productSearchableFields = [
    'searchTerm',
    'name',
    'product_id',
    'price',
    'stocked',
    'category',
    'sub_category',
    'rating',
    'visibility',
    'weight',
    'brand',
    'shop',
];

export const productFilterEndpoints = [
    {
        $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: 'shop_id',
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

    {
        $lookup: {
            from: 'reviews',
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
        $lookup: {
            from: 'customers', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'reviews.author.customer',
            foreignField: '_id',
            as: 'reviews.author.userDetails',
        },
    },

    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            product_id: { $first: '$product_id' },
            price: { $first: '$price' },
            stocked: { $first: '$stocked' },
            category: { $first: '$category' },
            sub_category: { $first: '$sub_category' },
            visibility: { $first: '$visibility' },
            description: { $first: '$description' },
            variations: { $first: '$variations' },
            product_image: { $first: '$product_image' },
            weight: { $first: '$weight' },
            diamention: { $first: '$diamention' },
            features: { $first: '$features' },
            rating: { $first: '$rating' },
            brand: { $first: '$brand' },
            reviews: { $push: '$reviews' },
            shop: { $first: '$shop' },
        },
    },
    {
        $project: {
            'shop._id': 0,
            'shop.shop_review': 0,
            'shop.shop_owner': 0,
            'shop.shop_banner': 0,
            'reviews.author.password': 0,
        },
    },
];
export const allProductFilterEndpoints = [
    {
        $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: 'shop_id',
            as: 'shop',
        },
    },
    {
        $unwind: '$shop',
    },
    {
        $lookup: {
            from: 'reviews',
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
        $lookup: {
            from: 'customers', // Assuming "reviews" is the name of the collection containing reviews
            localField: 'reviews.author.customer',
            foreignField: '_id',
            as: 'reviews.author.userDetails',
        },
    },

    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            product_id: { $first: '$product_id' },
            price: { $first: '$price' },
            stocked: { $first: '$stocked' },
            category: { $first: '$category' },
            sub_category: { $first: '$sub_category' },
            visibility: { $first: '$visibility' },
            description: { $first: '$description' },
            variations: { $first: '$variations' },
            product_image: { $first: '$product_image' },
            weight: { $first: '$weight' },
            diamention: { $first: '$diamention' },
            features: { $first: '$features' },
            rating: { $first: '$rating' },
            brand: { $first: '$brand' },
            reviews: { $push: '$reviews' },
            shop: { $first: '$shop' },
        },
    },
    {
        $project: {
            'shop._id': 0,
            'shop.shop_review': 0,
            'shop.shop_owner': 0,
            'shop.shop_banner': 0,
            'reviews.author.password': 0,
        },
    },
];
