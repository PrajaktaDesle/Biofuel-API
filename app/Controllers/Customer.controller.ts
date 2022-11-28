import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import customerService from '../Services/Customer.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";


const createCustomerEstimate: IController = async (req, res) => {
    let estimate: any;
    try {
        estimate = await customerService.createCustomerEstimate(req.body);
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
        estimate = await customerService.updateCustomerEstimate(req.body);
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
        let estimate = await customerService.fetchCustomerEstimateById( req.query.id )
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

const fetchAllCustomerEstimates : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await customerService.fetchAllCustomerEstimates( )
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
    createCustomerEstimate,
    udpateCustomerEstimate,
    fetchCustomerEstimateById,
    fetchAllCustomerEstimates
}