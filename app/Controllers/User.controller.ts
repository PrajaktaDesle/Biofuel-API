import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import userService from '../Services/User.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import {isError} from "util";


const login: IController = async (req, res) => {
    userService.loginUser(
        req.body.email,
        req.body.password,
    ).then( (user) => {
        if(isError(user)){
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                user.message
            );
        }else{
            apiResponse.result(res, user[0], httpStatusCodes.OK);
        }
    }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            //locale.INVALID_CREDENTIALS,
        );
    });
};

const register: IController = async (req, res) => {
    let user;
    try {
        user = await userService.createUser(
            req.body.email,
            req.body.password,
            req.body.name,
        );
    } catch (e) {
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                'EMAIL_ALREADY_EXISTS',
            );
            return;
        }
    }
    if (user) {
        apiResponse.result(res, user, httpStatusCodes.CREATED);
    } else {
        LOGGER.info("errror" , user)
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
};



export default {
    login,
    register
};
