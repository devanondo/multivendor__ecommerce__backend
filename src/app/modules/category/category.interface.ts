import { Model, Types } from 'mongoose';

export type ISubCategory = {
    title: string;
    description: string;
    banner_image?: string;
};

export type ICategory = {
    title: string;
    description: string;
    banner_image: string;
    active_status: boolean;
    sub_category?: ISubCategory[];
    author: Types.ObjectId;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
