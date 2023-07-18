import { Model } from 'mongoose';
export type IProductItems = {
    product_id: string;
    product_quantity: number;
    discount: number;
    price: number;
    order_status: string;
};

export type IOrderItem = {
    shop_id: string;
    products: IProductItems[];
};

export type IOrder = {
    order_id: string;
    customer_id: string;
    shipping_address: string;
    total_price: number;
    payment_method: string;
    order_status: string;
    billing_address?: string;
    notes?: string;
    refund_requested?: boolean;
    order_items: IOrderItem[];
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

export type IOrderFilter = {
    searchTerm?: string;
    order_id?: string;
    customer_id?: string;
    payment_method?: string;
    order_status?: string;
    refund_requested?: boolean;
};
