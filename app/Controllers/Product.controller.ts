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
            apiResponse.error( res, 
                               httpStatusCodes.BAD_REQUEST );
        } 
        else {
            apiResponse.result( res, 
                                product,
                                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               'MOBILE_AND_EMAIL_ALREADY_EXISTS' )
        }
        else{
            apiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               e.message )
        }
        return;
    }
};

const fetchProductById : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.fetchProductById( req.query.id )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProducts : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.fetchAllProducts( req )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProductCategories : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.fetchAllProductCategories(  )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}
const updateProductById : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.updateProductById( req )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.CREATED )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProductUsageUnits : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.fetchAllProductUsageUnits(  )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const updateProductStatus : IController = async ( req:any , res:any ) => {
    try{
        let product = await productService.updateProductStatus( req.body )
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
                                     product,
                                     httpStatusCodes.CREATED )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}
export default {
    createProduct,
    fetchProductById,
    updateProductById,
    fetchAllProducts,
    updateProductStatus,
    fetchAllProductCategories,
    fetchAllProductUsageUnits
}