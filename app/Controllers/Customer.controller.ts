import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerService from '../Services/Customer.service';
import formidable from 'formidable';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import {isError} from "util";
import * as util from "util";

const register: IController = async (req, res) => {
    let customer;
try {
    let tenant= req.headers["tenant-id"];
    const form = new formidable.IncomingForm()
    // form.tenant_id = tenant
    customer = await customerService.createCustomer(form,tenant);
    console.log('customer at controller-----> ',customer);

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
    // @ts-ignore
    if (customer) {
        apiResponse.result(res, customer, httpStatusCodes.CREATED);
    } else {
        LOGGER.info("error", customer)
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
};

const fetchCustomers: IController = async (req, res) => {
    const tenant=req.headers["tenant-id"]
    // req.body.tenant_id=tenant;
    customerService.customerDetails(tenant)
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
                console.log("user 3", customer.message)
                // response.redirect('/home');
                apiResponse.result(res, customer, httpStatusCodes.OK);
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

export default {
    // login,
    register,
    fetchCustomers,
};