import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import CustomerService from "../Services/Customer.service";

const Create: IController = async (req, res) => {
    let customer: any;
    try {
        customer = await CustomerService.createCustomer(req)
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
    await CustomerService.fetchCustomersById(req.query.id)
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
     await CustomerService.updateCustomerdetails(req)
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

const fetchAllCustomers: IController = async (req, res) => {
    await CustomerService.fetchAll()
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
// customer-supplier mapping
const Create_customer_supplier: IController = async(req,res) => {
    let CSM: any;
    try {
        CSM = await CustomerService.CreateCSMService(req) ;
        if (CSM instanceof Error) {
            console.log("error", CSM)
            apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST );
        }
        else {
            apiResponse.result( res,
                CSM,
                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(res,
                httpStatusCodes.BAD_REQUEST)
        } else {
            apiResponse.error(res,
                httpStatusCodes.BAD_REQUEST)
        }
        return;
    }
};

const updateCSMStatus:IController = async ( req, res) => {
    let  result:any
    try{
        result = await  CustomerService.updateCSMService(req)
        if(result instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                result.message )
        }
        else{
            return apiResponse.result( res,
                result,
                httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST,
            error.message)
    }
}
const fetchAll_customers_suppliers:IController = async ( req:any , res:any ) => {
    try{
        let result = await CustomerService.fetchAllCSM()
        if ( result instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                result.message )
        }
        else{
            return apiResponse.result( res,
                result,
                httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST )
    }
}
const createCustomerEstimate: IController = async (req, res) => {
    let estimate: any;
    try {
        estimate = await CustomerService.createCustomerEstimate(req.body);
        console.log('estimate at controller-----> ', estimate);

        if (estimate instanceof Error) {
            console.log("error", estimate)
            apiResponse.error( res, 
                               httpStatusCodes.BAD_REQUEST );
        } 
        else {
            apiResponse.result( res, 
                                estimate,
                                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               'MOBILE_AND_EMAIL_ALREADY_EXISTS' )
        }
        else{
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               e.message )
        }
        return;
    }
};


const udpateCustomerEstimate: IController = async (req, res) => {
    let estimate: any;
    try {
        estimate = await CustomerService.updateCustomerEstimate(req.body);
        console.log('estimate at controller-----> ', estimate);

        if (estimate instanceof Error) {
            console.log("error", estimate)
            apiResponse.error( res, 
                               httpStatusCodes.BAD_REQUEST );
        } 
        else {
            apiResponse.result( res, 
                                estimate,
                                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               'MOBILE_AND_EMAIL_ALREADY_EXISTS' )
        }
        else{
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               e.message )
        }
        return;
    }
};

const fetchCustomerEstimateById : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await CustomerService.fetchCustomerEstimateById( req.query.id )
        if ( estimate instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    estimate.message )
        }
        else{
           return apiResponse.result( res,
                                     estimate,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
};

const fetchAllCustomerEstimates : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await CustomerService.fetchAllCustomerEstimates( )
        if ( estimate instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    estimate.message )
        }
        else{
           return apiResponse.result( res,
                                     estimate,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const createCustomerSalesOrder: IController = async (req, res) => {
    let sales_order: any;
    try {
        sales_order = await CustomerService.createCustomerSalesOrder(req.body);
        console.log('sales_order at controller-----> ', sales_order);

        if (sales_order instanceof Error) {
            console.log("error", sales_order)
            apiResponse.error( res, 
                               httpStatusCodes.BAD_REQUEST );
        } 
        else {
            apiResponse.result( res, 
                                sales_order,
                                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               'MOBILE_AND_EMAIL_ALREADY_EXISTS' )
        }
        else{
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               e.message )
        }
        return;
    }
};


const updateCustomerSalesOrder: IController = async (req, res) => {
    let sales_order: any;
    try {
        sales_order = await CustomerService.updateCustomerSalesOrder(req.body);
        console.log('sales_order at controller-----> ', sales_order);

        if (sales_order instanceof Error) {
            console.log("error", sales_order)
            apiResponse.error( res, 
                               httpStatusCodes.BAD_REQUEST );
        } 
        else {
            apiResponse.result( res, 
                                sales_order,
                                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               'MOBILE_AND_EMAIL_ALREADY_EXISTS' )
        }
        else{
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               e.message )
        }
        return;
    }
};

const fetchCustomerSalesOrderById : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await CustomerService.fetchCustomerSalesOrderById( req.query.id )
        if ( estimate instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    estimate.message )
        }
        else{
           return apiResponse.result( res,
                                     estimate,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllCustomerSalesOrders : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await CustomerService.fetchAllCustomerSalesOrders( )
        if ( estimate instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    estimate.message )
        }
        else{
           return apiResponse.result( res,
                                     estimate,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

export default {
                Create,
                fetchCustomerById,
                updateCustomerDetails,
                fetchAllCustomers,
                Create_customer_supplier, 
                updateCSMStatus, 
                fetchAll_customers_suppliers,
                createCustomerEstimate,
                udpateCustomerEstimate,
                fetchCustomerEstimateById,
                fetchAllCustomerEstimates,
                createCustomerSalesOrder,
                updateCustomerSalesOrder,
                fetchCustomerSalesOrderById,
                fetchAllCustomerSalesOrders

}