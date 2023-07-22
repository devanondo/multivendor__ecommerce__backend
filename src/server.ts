/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

process.on('uncaughtException', () => {
    console.log(`Uncaught Exception detected...`);
    process.exit(1);
});

let server: Server;
async function ConnectDatabase() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log(`🥃 Database Connected!`);

        server = app.listen(config.port, () => {
            console.log(`🛢️ Server is running on ${config.port}`);
        });
    } catch (error) {
        console.log('🤬 Faild to connect Database!');
    }

    process.on('unhandledRejection', (error) => {
        console.log(`UnhandledRejection is detected, closing the server... 🌂`);

        if (server) {
            server.close(() => {
                console.log(error);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
}

ConnectDatabase();

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
