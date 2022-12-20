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
        else if(product.length > 0){
            return apiResponse.result( res,
                                     product[0],
                                     httpStatusCodes.OK )
        }else{
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                "No Product Found");
        }
    }
    catch ( error : any ) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProducts : IController = async ( req:any , res:any ) => {
    try{
        let query = " "
        if(req.body.query != ""){
            query = ` WHERE (p.name like '%${req.body.query}%' OR p.hsn like '%${req.body.query}%' ) `
        }

        let product = await productService.fetchAllProducts(req.body.pageIndex, req.body.pageSize, req.body.sort, query)
        let count = await productService.fetchAllProductCount(query);
        if ( product instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    product.message )
        }
        else{
           return apiResponse.result( res,
               {data :product, total : count},
               httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProductCategories : IController = async ( req:any , res:any ) => {
    try{
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND name like '%"+ req.query.key + "%'" : "";
        let product = await productService.fetchAllProductCategories( query )
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
        LOGGER.info( "Error => ", error )
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
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllProductUsageUnits : IController = async ( req:any , res:any ) => {
    try{
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND name like '%"+ req.query.key + "%'" : "";
        let product = await productService.fetchAllProductUsageUnits( query )
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
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
}


const fetchAllProductRawMaterials: IController = async (req, res) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND name like '%"+ req.query.key + "%'" : "";
        let rawMaterials : any = await productService.fetchAllProductRawMaterials(query);
        if (rawMaterials instanceof Error) {
            console.log("error", rawMaterials)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, rawMaterials, httpStatusCodes.OK);
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

const fetchAllProductPackaging: IController = async (req, res) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND name like '%"+ req.query.key + "%'" : "";
        let packaging : any = await productService.fetchAllProductPackaging( query );
        if (packaging instanceof Error) {
            LOGGER.info("error", packaging)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, packaging, httpStatusCodes.OK);
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

const fetchAllProductsList: IController = async (req, res) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND p.name like '%"+ req.query.key + "%'" : "";
        let products : any = await productService.fetchAllProductsList( query );
        if (products instanceof Error) {
            LOGGER.info("error", products)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, products, httpStatusCodes.OK);
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
    createProduct,
    fetchProductById,
    updateProductById,
    fetchAllProducts,
    fetchAllProductCategories,
    fetchAllProductUsageUnits,
    fetchAllProductRawMaterials,
    fetchAllProductPackaging,
    fetchAllProductsList
}