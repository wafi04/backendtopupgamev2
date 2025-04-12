import { Response } from 'express';
import { ResponseData } from '../interfaces/response';

export function sendResponse<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
): void {
    const response: ResponseData<T> = {
        data,
        message,
        statusCode
    };
    res.status(statusCode).json(response);
}