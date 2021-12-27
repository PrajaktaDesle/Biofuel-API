import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import rdService from '../Services/Rd.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";


const create_RD: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await rdService.create_rd(req.body)
        .then((RD : Object) => {
            if(RD instanceof Error){
                LOGGER.info("user 2", RD.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    RD.message
                );
            }else{
                LOGGER.info("RD info->", RD)
                apiResponse.result(res, RD, httpStatusCodes.OK);
            }
        }).catch(err => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
}
const fetch_RD: IController = async (req, res) => {
    // @ts-ignore
    await rdService.fetchRdByCustomer(req.query.customer_id, parseInt(req.headers["tenant-id"]))
        .then((RD : Object) => {
            if(RD instanceof Error){
                LOGGER.info("RD List", RD.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    RD.message
                );
            }else{
                LOGGER.info("RD List", RD);
                // @ts-ignore
                apiResponse.result(res, RD, httpStatusCodes.OK);
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
    fetch_RD,
    create_RD,
};