import { Response } from "express";
import { ErrorResponse } from "../interfaces/response";
import { ErrorCode } from "../constants/error";

export const handleError = (res: Response, statusCode: number, message: string, error: ErrorCode) => {
    const response: ErrorResponse = {
        error,
        message,
        statusCode,
        timestamp: new Date().toISOString()
    };
    res.status(statusCode).json(response);
};