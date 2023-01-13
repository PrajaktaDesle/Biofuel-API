import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import addressService from '../Services/Address.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const getAllCities: IController = async (req, res) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " where name like '%"+ req.query.key + "%'" : "";
        let cities : any = await addressService.getAllCities(query);
        if (cities instanceof Error) {
            LOGGER.info("error", cities)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, cities, httpStatusCodes.OK);
        }
    } catch (e:any) {
        LOGGER.info("controller ->", e)
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
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " where name like '%"+ req.query.key + "%'" : "";
        let states : any = await addressService.getAllStates(query);
        if (states instanceof Error) {
            LOGGER.info("error", states)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, states, httpStatusCodes.OK);
        }
    } catch (e:any) {
        LOGGER.info("controller ->", e)
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
            return;
    }
};

const getCitiesByState: IController = async (req:any, res:any) => {
    try {
        let query : string = (req.body.key !== undefined && req.body.key !== null && req.body.key !== "") ? " AND act.name like '%"+ req.body.key + "%'" : "";
        let states : any = await addressService.getCitiesByState(req.body.state_id, query);
        if (states instanceof Error) {
            LOGGER.info("error", states)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, states, httpStatusCodes.OK);
        }
    } catch (e:any) {
        LOGGER.info("controller ->", e)
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
    getAllStates,
    getCitiesByState
}