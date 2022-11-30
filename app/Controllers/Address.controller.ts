import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import addressService from '../Services/Address.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const getAllCities: IController = async (req, res) => {
    try {
        let cities : any = await addressService.getAllCities();
        if (cities instanceof Error) {
            console.log("error", cities)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, cities, httpStatusCodes.OK);
        }
    } catch (e:any) {
        console.log("controller ->", e)
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
            return;
    }
};

const getAllStates: IController = async (req, res) => {
    try {
        let states : any = await addressService.getAllStates();
        if (states instanceof Error) {
            console.log("error", states)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, states, httpStatusCodes.OK);
        }
    } catch (e:any) {
        console.log("controller ->", e)
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
            return;
    }
};

export default {
    getAllCities,
    getAllStates
}