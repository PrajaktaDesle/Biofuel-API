import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import userService from '../Services/User.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import customerService from "../Services/Customer.service";

const login: IController = async (req, res) => {
    console.log(1)
    const tenant=req.headers["tenant-id"]
    req.body.tenant_id=tenant;
    userService.loginUser(req.body)
        .then( (user) => {
        if(user instanceof Error){
            console.log("User 2", user.message)
            apiResponse.error(
                res,
                // response.send('Incorrect Username and/or Password!');
                httpStatusCodes.BAD_REQUEST,
                user.message
            );
        }else{
            console.log("User 3", user.message)
            // response.redirect('/home');
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
        let tenant= req.headers["tenant-id"];
        // console.log("tenant", tenant)
        req.body.tenant_id = tenant;
        user = await userService.createUser(req.body);
    } catch (e) {
        console.log(e)
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
        LOGGER.info("error" , user)
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
};


const fetchUsers: IController = async (req, res) => {
    const tenant=req.headers["tenant-id"]
    // req.body.tenant_id=tenant;
    userService.userDetails(tenant)
        .then( (users) => {
            if(users instanceof Error){
                console.log("User 2", users.message)
                apiResponse.error(
                    res,
                    // response.send('Incorrect Username and/or Password!');
                    httpStatusCodes.BAD_REQUEST,
                    users.message
                );
            }else{
                console.log("User 3", users.message)
                // response.redirect('/home');
                apiResponse.result(res, users, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            //locale.INVALID_CREDENTIALS,
        );
    });
}


const updateUserDetails: IController = async (req, res) => {
    req.body.tenant_id = req.headers["tenant-id"]
    userService.updateUserDetails(req.body)
        .then( (user) => {
            if(user instanceof Error){
                console.log("user 2", user.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    user.message
                );
            }else{
                console.log("user 3", user)
                apiResponse.result(res, user, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};

const updateUserStatus: IController = async (req, res) => {
    req.body.tenant_id = req.headers["tenant-id"]
    userService.updateUserStatus(req.body)
        .then( (user) => {
            if(user instanceof Error){
                console.log("user 2", user.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    user.message
                );
            }else{
                console.log("user 3", user)
                apiResponse.result(res, user, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};

export default {
    login,
    register,
    fetchUsers,
    updateUserDetails,
    updateUserStatus
};
