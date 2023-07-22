import { Model } from 'mongoose';
import { IImage } from '../../../interfaces/commong.interface';

export type IAdmin = {
    email: string;
    name?: {
        first_name?: string;
        last_name?: string;
    };
    address?: string;
    profile_picture?: IImage;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
