import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import customerOnboardService from "../Services/customerOnboard.service"
import customerService from "../Services/Customer.service";
import supplierService from "../Services/Supplier.service";
const Create: IController = async (req, res) => {
    let customer: any;
    try {
        customer = await customerOnboardService.createCustomer(req)
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
}
const fetchCustomerById: IController = async (req, res) => {
    await customerOnboardService.fetchCustomersById(req.query.id)
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
     await customerOnboardService.updateCustomerdetails(req)
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
            err.message
        );
    });
};

const updateCustomerStatus: IController = async (req, res) => {
    customerOnboardService.updateCustomerstatus( req.body )
        .then( (customer) => {
            // @ts-ignore
            if(customer instanceof Error){
                console.log("user 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                console.log("user 3", customer)
                // @ts-ignore
                apiResponse.result(res, customer, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            err.message

        );
    });
};
const fetchAllCustomers: IController = async (req, res) => {
    await customerOnboardService.fetchAll()
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

export default {Create,fetchCustomerById, updateCustomerDetails, updateCustomerStatus, fetchAllCustomers}