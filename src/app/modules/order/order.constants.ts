export const orderFilterableFields = [
    'searchTerm',
    'order_id',
    'shipping_address',
    'order_items.shop_id',
    'billing_address',
    'order_items.products.product_id',
];
export const orderSearchableFields = [
    'searchTerm',
    'order_id',
    'customer_id',
    'payment_method',
    'order_status',
    'refund_requested',
];

export const orderStatus = [
    'received',
    'processing',
    'shipped',
    'delivered',
    'req_cancel',
    'cancelled',
];

export const shopOrderFilterEndpoints = [
    {
        $unwind: '$order_items',
    },
    {
        $addFields: {
            'order_items.order_id': '$order_id', // Add the order_id field to each order_item
            'order_items.total_price': {
                $reduce: {
                    input: '$order_items.products',
                    initialValue: 0,
                    in: { $add: ['$$value', '$$this.price'] },
                },
            },
        },
    },
    {
        $group: {
            _id: '$order_items.shop_id',
            orders: {
                $push: '$order_items',
            },
        },
    },
];
