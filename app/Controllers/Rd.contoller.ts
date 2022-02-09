import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import rdService from '../Services/Rd.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";


const createRd: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await rdService.createRd(req.body)
        .then((rdDetails : Object) => {
            if(rdDetails instanceof Error){
                LOGGER.info("User 2", rdDetails.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    rdDetails.message
                );
            }else{
                LOGGER.info("RD info->", rdDetails)
                apiResponse.result(res, rdDetails, httpStatusCodes.OK);
            }
        }).catch(err => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
}
const fetchRd: IController = async (req, res) => {
    // @ts-ignore
    await rdService.fetchRdByCustomerId(req.query.customer_id, parseInt(req.headers["tenant-id"]))
        .then((rdDetails : any) => {
            if(rdDetails instanceof Error){
                LOGGER.info("RD List", rdDetails.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    rdDetails.message
                );
            }else{
                LOGGER.info("User 3", rdDetails)
                if(rdDetails.length > 0 )
                    apiResponse.result(res, rdDetails, httpStatusCodes.OK);
                else{
                    throw new Error("value didnt match");
                }
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}

const fetchRdDetails: IController = async (req, res) => {

    await rdService.fetchRdDetailsByTransactionId(req.query.transaction_id,  req.headers["tenant-id"])
        .then((RdDetails : any) => {
            if(RdDetails instanceof Error){
                LOGGER.info("RD Transaction List", RdDetails.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    RdDetails.message
                );
            }else{
                LOGGER.info("User 3", RdDetails)
                if(RdDetails.length != 0 )
                    apiResponse.result(res, RdDetails, httpStatusCodes.OK);
                else{
                    throw new Error("value didnt match");
                }
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}

const fetchAllRdByTenant: IController = async (req, res) => {

    await rdService.fetchAllRdByTenant(Number(req.headers["tenant-id"]))
        .then((RdAll:any) => {
            if(RdAll instanceof Error){
                LOGGER.info("RD All List", RdAll.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    RdAll.message
                );
            }else{
                LOGGER.info("User 3", RdAll)
                if(RdAll.length != 0 )
                    apiResponse.result(res, RdAll, httpStatusCodes.OK);
                else{
                    throw new Error("value didnt match");
                }
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}


export default {
    fetchRd,
    createRd,
    fetchRdDetails,
    fetchAllRdByTenant
};
