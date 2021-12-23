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
    let customer : any;
try {
    let tenant= req.headers["tenant-id"];
    console.log("entry")
    customer = await customerService.createCustomer(req,tenant);
    console.log('customer at controller-----> ',customer);
    if (customer instanceof Error) {
        console.log("error", customer)
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
        apiResponse.result(res, {customer}, httpStatusCodes.CREATED);
        }
    } catch (e) {
    console.log("controller ->", e)
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


const selectCustomer: IController = async (req, res) => {
    // req.query.tenant_id = req.headers["tenant-id"];
    customerService.fetch_customer (req.query.id,  req.headers["tenant-id"])
        .then( (customer_fetch) => {
            if(customer_fetch instanceof Error){
                console.log("user 2", customer_fetch.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer_fetch.message
                );
            }else{
                console.log("user 3", customer_fetch)
                apiResponse.result(res, {customer_fetch}, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,

        );
    });
}


const login: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"];
    await customerService.loginCustomer(req.body)
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
    await customerService.verify_customer_otp(req.body)
        .then( (customer) => {
            if(customer instanceof Error){
                LOGGER.info("user 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                LOGGER.info("Login Successful");
                 apiResponse.result(res,{customer}, httpStatusCodes.OK);
            }
        }).catch(err => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            //locale.INVALID_CREDENTIALS,
        );
    });
};


export default {
    register,
    fetchCustomers,
    login,
    verify_otp,
    selectCustomer
};