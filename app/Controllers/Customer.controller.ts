import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerService from '../Services/Customer.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const login: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"];
    customerService.loginCustomer(req.body)
        .then( (customer) => {
            if(customer instanceof Error){
                console.log("user 2", customer.message)
                apiResponse.error(
                    res,
                    // response.send('Incorrect Username and/or Password!');
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                // console.log("user 3", customer.message)
                apiResponse.result(res, {customer}, httpStatusCodes.OK);
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

const verify_otp: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"];
    customerService.verify_customer_otp(req.body)
        .then( (customer) => {
            if(customer instanceof Error){
                console.log("user 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                console.log("Login Successful");
                 apiResponse.result(res,{customer}, httpStatusCodes.OK);
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


export default {
    login,
    // register
    verify_otp
};
