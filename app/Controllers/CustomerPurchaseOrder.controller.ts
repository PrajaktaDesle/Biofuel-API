import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerPOService from '../Services/CustomerPurchaseOrder.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createCustomerPO: IController = async (req, res) => {
    let customer: any;
    try {
        console.log("entry")
        customer = await customerPOService.createCustomerPO(req.body);
        console.log('Customer at controller-----> ', customer);
        if (customer instanceof Error) {
            console.log("error", customer)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res, 
            customer,
            httpStatusCodes.CREATED);
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

const fetchAllCustomerPO: IController = async (req, res) => {
    customerPOService.fetchAllCustomerPO()
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


const fetchCustomerPOById: IController = async (req, res) => {
    customerPOService.fetchCustomerPOById(req.query.id)
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



const updateCustomerPODetails: IController = async (req, res) => {
    req.body.tenant_id = req.headers["tenant-id"]
    customerPOService.updateCustomerPODetails(req.body)
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
    createCustomerPO,
    fetchAllCustomerPO,
    fetchCustomerPOById,
    updateCustomerPODetails,
};
