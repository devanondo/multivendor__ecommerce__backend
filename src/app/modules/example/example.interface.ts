import { Model } from 'mongoose';

export type IExample = {
    name: string;
    password?: string;
    email: string;
};

export type ExampleModel = Model<IExample, Record<string, unknown>>;
