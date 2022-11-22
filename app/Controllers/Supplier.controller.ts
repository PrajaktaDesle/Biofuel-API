import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import supplierService from '../Services/Supplier.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";
import { SupplierModel } from '../Models/Supplier/Supplier.model';

const register: IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.createSupplier(req);
        console.log('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            console.log("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
            supplier,
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

const login:IController = async ( req : any, res : any ) => {
    try{
        const supplier : any =  await supplierService.loginSupplier( req.body )   
        if ( supplier instanceof Error ){
            console.log( "Controller Error : ", supplier.message )
            apiResponse.error( 
                res, 
                httpStatusCodes.BAD_REQUEST,
                supplier.message
            )
        }
        else{
            apiResponse.result( res, supplier , httpStatusCodes.OK );
        }
    }
    catch( err ) {
        console.log("Controller Error : ", err);
        apiResponse.error( res ,
                           httpStatusCodes.BAD_REQUEST );

    }
}

const verify_otp : IController = async ( req, res) => {
    try{
        const result : any  = await supplierService.verify_supplier_otp( req.body )
        if ( result instanceof Error ){
            LOGGER.info('Controller Error : ', result.message )
            apiResponse.error( 
                res, 
                httpStatusCodes.BAD_REQUEST,
                result.message
            )
        }
        else{
            LOGGER.info( "LOGIN SUCCESSFULL")
            apiResponse.result( res,  result, httpStatusCodes.OK )
        }
    }
    catch( error ){
        LOGGER.info( "Controller Error : ", error )
        apiResponse.error( res, httpStatusCodes.BAD_REQUEST )
    }
}

const fetchAllSuppliers: IController = async (req, res) => {
    supplierService.fetchAllSuppliers()
        .then( (suppliers) => {
            if(suppliers instanceof Error){
                // console.log("Error : ", suppliers.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    suppliers.message
                );
            }else{
                // console.log("suppplier : ", suppliers)
                apiResponse.result(res, suppliers, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            //locale.INVALID_CREDENTIALS,
        );
    });
};


const fetchSupplierById: IController = async (req, res) => {
    supplierService.fetchSupplierById(req.query.id)
        .then( (supplier : any) => {
            if(supplier instanceof Error){
                console.log("User 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                console.log("User 3", supplier)
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};



const updateSuppliersDetails: IController = async (req, res) => {
    supplierService.updateSuppliersDetails( req.body )
        .then( (supplier) => {
            if(supplier instanceof Error){
                console.log("user 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                console.log("user 3", supplier)
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch(err => {
        console.log("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            err.message

        );
    });
};


const formidableUpdateDetails : IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.formidableUpdateDetails(req);
        if (supplier instanceof Error) {
            console.log("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.CREATED);
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

const getAllCityWiseStates: IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.getAllCityWiseStates();
        if (supplier instanceof Error) {
            console.log("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.CREATED);
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
    register,
    login,
    verify_otp,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSuppliersDetails,
    formidableUpdateDetails,
    getAllCityWiseStates
};
