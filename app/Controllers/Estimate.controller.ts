import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import estimateService from '../Services/Estimates.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createEstimate: IController = async (req, res) => {
    let estimate: any;
    try {
        estimate = await estimateService.createEstimate(req.body);
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


const udpateEstimate: IController = async (req, res) => {
    let estimate: any;
    try {
        estimate = await estimateService.updateEstimate(req.body);
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

const fetchEstimateById : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await estimateService.fetchEstimateById( req.query.id )
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

const fetchAllEstimates : IController = async ( req:any , res:any ) => {
    try{
        let estimate = await estimateService.fetchAllestimates( )
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
    createEstimate,
    udpateEstimate,
    fetchEstimateById,
    fetchAllEstimates
}