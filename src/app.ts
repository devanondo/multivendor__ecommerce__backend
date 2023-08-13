import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import routes from './app/routes';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';

const app: Application = express();

// Cloudinary
cloudinary.v2.config({
    secure: true,
});

//Parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' })); // Adjust the limit as needed

app.use(cors());

// Application routes
app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: '🛢️ Server is Running...',
    });
});

// global Error handler
app.use(globalErrorHandler);

export default app;
