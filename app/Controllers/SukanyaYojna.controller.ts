import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';

import LOGGER from "../config/LOGGER";
import sukanyaYojnaService from "../Services/SukanyaYojna.service";



const createSukanyaYojna : IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await sukanyaYojnaService.createSukanyaYojna(req.body)
        .then((SukanyaInformation : any) => {
            if(SukanyaInformation instanceof Error){
                LOGGER.info("SukanyaYojna", SukanyaInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    SukanyaInformation.message
                );
            }else{
                LOGGER.info("SukanyaInformation->", SukanyaInformation)
                apiResponse.result(res, SukanyaInformation, httpStatusCodes.OK);
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
    await sukanyaYojnaService.fetchByCustomerId(req.headers["tenant-id"],req.query.customer_id)
        .then((SukanyaInformation:any) => {
            if(SukanyaInformation instanceof Error){
                LOGGER.info("SukanyaYojna", SukanyaInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    SukanyaInformation.message
                );
            }else{
                if(SukanyaInformation.length == 0) throw new Error("Value mismatched")
                LOGGER.info("transactionType ->", SukanyaInformation)
                apiResponse.result(res, SukanyaInformation, httpStatusCodes.OK);
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
    createSukanyaYojna,
    fetchByCustomerId
};