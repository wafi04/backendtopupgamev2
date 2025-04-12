export type ResponseData<T> = {
    data: T;
    message: string;
    statusCode?: number;
    success?: boolean;
    timestamp?: string;
};

export type ErrorResponse = {
    error: string;
    message: string;
    statusCode: number;
    timestamp?: string;
};