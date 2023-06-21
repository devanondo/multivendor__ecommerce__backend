import { Schema, model } from 'mongoose';
import { ExampleModel, IExample } from './example.interface';

const exampleSchema = new Schema<IExample>(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Example = model<IExample, ExampleModel>('Example', exampleSchema);
