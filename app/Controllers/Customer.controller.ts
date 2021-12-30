import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerService from '../Services/Customer.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const register: IController = async (req, res) => {
    let customer : any;
try {
    let tenant= req.headers["tenant-id"];
    console.log("entry")
    customer = await customerService.createCustomer(req,tenant);
    console.log('Customer at controller-----> ',customer);
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

const fetchAllCustomers: IController = async (req, res) => {
    customerService.fetchAllCustomers(req.headers["tenant-id"])
        .then( (customers) => {
            if(customers instanceof Error){
                console.log("User 2", customers.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customers.message
                );
            }else{
                console.log("User 3", customers)
                apiResponse.result(res, customers, httpStatusCodes.OK);
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


const fetchCustomerById: IController = async (req, res) => {
    customerService.fetchCustomerById(req.query.id,  req.headers["tenant-id"])
        .then( (customer) => {
            if(customer instanceof Error){
                console.log("User 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                console.log("User 3", customer)
                apiResponse.result(res, customer, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};


const login: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"];
    await customerService.loginCustomer(req.body)
        .then( (customer) => {
            if(customer instanceof Error){
                console.log("User 2", customer.message)
                apiResponse.error(
                    res,
                    // response.send('Incorrect Username and/or Password!');
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
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
                LOGGER.info("User 2", customer.message)
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


const updateCustomerById: IController = async (req, res) => {
    let tenant_id=req.headers["tenant-id"]
    req.body.tenant_id=tenant_id;
    customerService.updateCustomerById(req.body)
        .then( (customer) => {
            if(customer instanceof Error){
                console.log("user 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                console.log("user 3", customer)
                apiResponse.result(res, customer, httpStatusCodes.OK);
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
    register,
    fetchAllCustomers,
    login,
    verify_otp,
    fetchCustomerById,
    updateCustomerById
};