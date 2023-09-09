import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type IShop = {
    shop_name: string;
    shop_id: string;
    shop_description: string;
    shop_type: string;
    shop_logo: IImage;
    shop_banner: IImage[];
    active_status: 'public' | 'private' | 'protected' | 'restricted';
    shop_rating?: number;
    shop_review: Types.ObjectId[];
    shop_owner: string;

    shop_email?: string;
    shop_website?: string;
    shop_address?: string;
    shop_phone?: string;
};

export type ShopModel = Model<IShop, Record<string, unknown>>;

export type IShopFilter = {
    searchTerm?: string;
    shop_name?: string;
    shop_id?: string;
    shop_type?: string;
    active_status?: string;
    shop_rating?: string | number;
};
