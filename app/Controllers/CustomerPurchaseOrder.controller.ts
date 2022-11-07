import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerService from '../Services/Customer.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const create: IController = async (req, res) => {
    let customer: any;
    try {
        console.log("entry")
        customer = await customerService.createCustomer(req.body);
        console.log('Customer at controller-----> ', customer);
        if (customer instanceof Error) {
            console.log("error", customer)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res, {
                customer
            }, httpStatusCodes.CREATED);
        }
    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                'MOBILE_AND_EMAIL_ALREADY_EXISTS',

            );
        }
        else{
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
        }
        return;
    }
};

const fetchAllCustomers: IController = async (req, res) => {
    customerService.fetchAllCustomers()
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
    customerService.fetchCustomerById(req.query.id)
        .then( (customer : any) => {
            if(customer instanceof Error){
                console.log("User 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                // console.log("User 3", customer)
                apiResponse.result(res, customer, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};



const updateCustomerDetails: IController = async (req, res) => {
    req.body.tenant_id = req.headers["tenant-id"]
    customerService.updateCustomerDetails(req.body)
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
    create,
    fetchAllCustomers,
    fetchCustomerById,
    updateCustomerDetails,
};
