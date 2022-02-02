import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';

import LOGGER from "../config/LOGGER";
import lakhpatiYojnaService from "../Services/LakhpatiYojna.service";



const createLakhpatiYojna : IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await lakhpatiYojnaService.createLakhpatiYojna(req.body)
        .then((LakhpatiInformation : any) => {
            if(LakhpatiInformation instanceof Error){
                LOGGER.info("SukanyaYojna", LakhpatiInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    LakhpatiInformation.message
                );
            }else{
                LOGGER.info("SukanyaInformation->", LakhpatiInformation)
                apiResponse.result(res, LakhpatiInformation, httpStatusCodes.OK);
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
    await lakhpatiYojnaService.fetchByCustomerId(req.headers["tenant-id"],req.query.customer_id)
        .then((LakhpatiInformation:any) => {
            if(LakhpatiInformation instanceof Error){
                LOGGER.info("SukanyaYojna", LakhpatiInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    LakhpatiInformation.message
                );
            }else{
                if(LakhpatiInformation.length == 0) throw new Error("Value mismatched")
                LOGGER.info("transactionType ->", LakhpatiInformation)
                apiResponse.result(res, LakhpatiInformation, httpStatusCodes.OK);
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
    createLakhpatiYojna,
    fetchByCustomerId
};