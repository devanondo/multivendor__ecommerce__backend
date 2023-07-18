import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const OrderSchema = new Schema<IOrder>({
    order_id: {
        type: String,
        required: true,
    },
    customer_id: {
        type: String,
        required: true,
    },
    shipping_address: {
        type: String,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    order_status: {
        type: String,
        default: 'received',
    },
    billing_address: {
        type: String,
    },
    notes: {
        type: String,
    },
    refund_requested: {
        type: Boolean,
        default: false,
    },
    order_items: [
        {
            shop_id: {
                type: String,
                required: true,
            },
            products: [
                {
                    product_id: { type: String, required: true },
                    product_quantity: { type: Number, required: true },
                    discount: { type: Number, required: true },
                    price: { type: Number, required: true },
                    order_status: {
                        type: String,
                        default: 'received',
                    },
                },
            ],
        },
    ],
});

export const Order = model<IOrder, OrderModel>('Order', OrderSchema);
