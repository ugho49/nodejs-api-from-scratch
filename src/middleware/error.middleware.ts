import { NextFunction, Request, Response } from 'express';
import HttpException from '@/utils/exceptions/http.exception';

export function errorHandler(error: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const timestamp = error.timestamp || new Date().getTime();
    res.status(status).json({ status, message, timestamp });
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    next(new HttpException(404, `🔍 - Not Found - ${req.originalUrl}`));
}
