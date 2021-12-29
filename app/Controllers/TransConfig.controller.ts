import httpStatusCodes from 'http-status-codes';

import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import transConfigService from '../Services/TransConfig.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createTransConfig: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await transConfigService.createTransInformation(req.body)
        .then((TC : Object) => {
            if(TC instanceof Error){
                LOGGER.info("User 2", TC.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    TC.message
                );
            }else{
                LOGGER.info("TC info->", TC)
                apiResponse.result(res, TC, httpStatusCodes.OK);
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}


const fetchTransConfig: IController = async (req, res) => {

    await transConfigService.fetchTransInformation(req.headers["tenant-id"],req.query.transaction_type)
        .then((transInformation : Object) => {
            if(transInformation instanceof Error){
                LOGGER.info("User 2", transInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    transInformation.message
                );
            }else{
                LOGGER.info("transactionType ->", transInformation)
                apiResponse.result(res, transInformation, httpStatusCodes.OK);
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
    fetchTransConfig,
    createTransConfig,
};