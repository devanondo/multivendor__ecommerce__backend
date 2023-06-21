import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import routes from './app/routes';

const app: Application = express();

//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
