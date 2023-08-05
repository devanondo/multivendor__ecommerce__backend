import { Model, Types } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type ISubCategory = {
    title: string;
    description: string;
    banner_image?: IImage | string;
    active_status: 'active' | 'pending' | 'restricted';
};

export type ICategory = {
    title: string;
    description: string;
    banner_image: IImage[];
    active_status: 'active' | 'pending' | 'restricted';
    sub_category?: ISubCategory[];
    author: Types.ObjectId;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;

export type ICagegoryFilter = {
    searchTerm?: string;
    active_status?: 'active' | 'pending' | 'restricted';
};
