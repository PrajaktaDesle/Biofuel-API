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
        .then((rdDetails : Object) => {
            if(rdDetails instanceof Error){
                LOGGER.info("RD List", rdDetails.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    rdDetails.message
                );
            }else{
                LOGGER.info("User 3", rdDetails)
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


export default {
    fetchRd,
    createRd,
};
