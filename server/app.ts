import express, { Request, Response, NextFunction } from 'express';
import Stock from './Models/stockModel';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        'status': 'fail',
        'message': 'Endpoint not found'
    });
});

export default app;
