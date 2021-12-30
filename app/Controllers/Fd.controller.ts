import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import fdService from '../Services/Fd.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createFd: IController = async (req, res) => {
    req.body.tenant_id=req.headers["tenant-id"]
    await fdService.createFD(req.body)
        .then((FDInformation : Object) => {
            if(FDInformation instanceof Error){
                LOGGER.info("FD", FDInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    FDInformation.message
                );
            }else{
                LOGGER.info("FDInformation->", FDInformation)
                apiResponse.result(res, FDInformation, httpStatusCodes.OK);
            }
        }).catch(err => {
            LOGGER.info("Error  ->", err);
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
            );
        });
}

const fetchFdByCustomer: IController = async (req, res) => {
    await fdService.fetchFdByCustomer(req.headers["tenant-id"],req.query.customer_id)
        .then((FDInformation : Object) => {
            if(FDInformation instanceof Error){
                LOGGER.info("FD", FDInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    FDInformation.message
                );
            }else{
                LOGGER.info("transactionType ->", FDInformation)
                apiResponse.result(res, [{1:12679908989}], httpStatusCodes.OK);
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
    createFd,
    fetchFdByCustomer
};
