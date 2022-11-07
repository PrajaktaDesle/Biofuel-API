import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import productService from '../Services/Product.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const createProduct: IController = async (req, res) => {
    let product: any;
    try {
        product = await productService.createProduct(req);
        console.log('product at controller-----> ', product);

        if (product instanceof Error) {
            console.log("error", product)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res, 
            product,
            httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                'MOBILE_AND_EMAIL_ALREADY_EXISTS',
            );
        }
        else{
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
        }
        return;
    }
};

export default {
    createProduct
}