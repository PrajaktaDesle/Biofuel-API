import { Response } from 'express';
import httpStatusCodes from 'http-status-codes';
export interface IOverrideRequest {
    code: number;
    message: string;
    positive: string;
    negative: string;
}

export interface ICookie {
    key: string;
    value: string;
}
export default class ApiResponse {
    static result = (
        res: Response,
        result: object,
        status: number = 200,
        //cookie: ICookie = null,
    ) => {
        res.status(status);
       /* if (cookie) {
            res.cookie(cookie.key, cookie.value);
        }*/
        res.json({
            status,
            message: "SUCCESS",
            result
        });
    };

    static error = (
        res: Response,
        status: number = 400,
        error: string = httpStatusCodes.getStatusText(status),
        //override: IOverrideRequest = null,
    ) => {
        res.status(status).json({
            //override,
            status,
            message: error,
            result:null
        });
    };

    static setCookie = (res: Response, key: string, value: string) => {
        res.cookie(key, value);
    };
}