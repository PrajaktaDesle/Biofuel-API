import IController from "../Types/IController";
import constants from "../Constants";
import apiResponse from "../utilities/ApiResponse";
import httpStatusCodes from "http-status-codes";
import LOGGER from "../config/LOGGER";
import addBalanceService from "../Services/BalanceHistory.service";

const addBalance: IController = async (req, res) => {
    await addBalanceService.createTransHistory(req.body)
        .then((TransHistInformation : Object) => {
            if(TransHistInformation instanceof Error){
                LOGGER.info("addBalanceService--->", TransHistInformation.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    TransHistInformation.message
                );
            }else{
                LOGGER.info("addBalanceService->", TransHistInformation)
                apiResponse.result(res, TransHistInformation, httpStatusCodes.OK);
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
    addBalance
};
