import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type IReviews = {
    message: string;
    images: IImage[];
    rating: number;
    author: string;
    product_id: string;
    _id?: Types.ObjectId;
};

export type ReviewModel = Model<IReviews, Record<string, unknown>>;
