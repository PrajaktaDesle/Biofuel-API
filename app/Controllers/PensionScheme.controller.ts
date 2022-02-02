import httpStatusCodes from 'http-status-codes';
import LOGGER from "../config/LOGGER";
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';

import pensionSchemeService from "../Services/PensionScheme.service";

const createPensionScheme : IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await pensionSchemeService.createPensionScheme(req.body)
        .then((PensionInformation : any) => {
            if(PensionInformation instanceof Error){
                LOGGER.info("PensionScheme", PensionInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    PensionInformation.message
                );
            }else{
                LOGGER.info("PensionInformation->", PensionInformation)
                apiResponse.result(res, PensionInformation, httpStatusCodes.OK);
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}

const fetchByCustomerId: IController = async (req, res) => {
    await pensionSchemeService.fetchByCustomerId(req.headers["tenant-id"],req.query.customer_id)
        .then((PensionInformation:any) => {
            if(PensionInformation instanceof Error){
                LOGGER.info("PensionScheme", PensionInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    PensionInformation.message
                );
            }else{
                if(PensionInformation.length == 0) throw new Error("Value mismatched")
                LOGGER.info("transactionType ->", PensionInformation)
                apiResponse.result(res, PensionInformation, httpStatusCodes.OK);
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
    createPensionScheme,
    fetchByCustomerId
};