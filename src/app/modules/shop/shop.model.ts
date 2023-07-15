import { Schema, model } from 'mongoose';
import { visibility } from '../product/product.constants';
import { IShop, ShopModel } from './shop.interface';

const ShopSchema = new Schema<IShop>({
    shop_name: {
        type: String,
        required: true,
        unique: true,
    },
    shop_id: {
        type: String,
        required: true,
        unique: true,
    },
    shop_description: {
        type: String,
        required: true,
    },
    shop_type: {
        type: String,
        required: true,
    },
    shop_logo: {
        public_id: String,
        url: String,
    },
    shop_banner: [
        {
            public_id: String,
            url: String,
        },
    ],
    active_status: {
        type: String,
        enum: visibility,
        default: 'private',
    },
    shop_rating: {
        type: Number,
        default: 0,
    },
    shop_review: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    shop_owner: {
        type: String,
        required: true,
    },
});

export const Shop = model<IShop, ShopModel>('Shop', ShopSchema);
