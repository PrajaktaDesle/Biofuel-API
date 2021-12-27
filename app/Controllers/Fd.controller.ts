import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import fdService from '../Services/Fd.services';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";


const create_FD: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await fdService.create_fd(req.body)
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
const fetch_FD: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await fdService.fetchFdByCustomer(req.body)
        .then(customer => {
            if(customer instanceof Error){
                LOGGER.info("user 2", customer.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            }else{
                LOGGER.info("user 3", customer)
                apiResponse.result(res, {customer}, httpStatusCodes.OK);
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
    fetch_FD,
    create_FD,
};