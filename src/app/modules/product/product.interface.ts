import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type IReviews = {
    message: string;
    images: string[];
    rating: number;
};

export type IProduct = {
    name: string;
    product_id: string;
    price: number;
    stocked: number;
    category: string;
    sub_category?: string;
    visibility: 'public' | 'private' | 'protected' | 'restricted';
    description?: string;
    variations?: string[];
    product_image: IImage[];
    weight?: number;
    diamention?: string;
    features?: string;
    rating?: number;
    brand?: string;
    reviews?: IReviews[];
    shop?: Types.ObjectId;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;

export type IProductFilter = {
    searchTerm?: string;
    name?: string;
    product_id?: string;
    price?: string | number;
    stocked?: string | number;
    category?: string;
    sub_category?: string;
    visibility?: 'public' | 'private' | 'protected' | 'restricted';
    weight?: string | number;
    rating?: string | number;
    brand?: string;
    shop?: Types.ObjectId;
};
