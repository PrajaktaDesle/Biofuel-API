import httpStatusCodes from 'http-status-codes';
import IController from '../Types/IController';
import apiResponse from '../utilities/ApiResponse';
import supplierService from '../Services/Supplier.service';
import constants from "../Constants";
import LOGGER from "../config/LOGGER";

const register: IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.createSupplier(req);
        console.log('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            console.log("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res, {
                supplier
            }, httpStatusCodes.CREATED);
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

const fetchAllSuppliers: IController = async (req, res) => {
    supplierService.fetchAllSuppliers()
        .then( (suppliers) => {
            if(suppliers instanceof Error){
                console.log("User 2", suppliers.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    suppliers.message
                );
            }else{
                console.log("User 3", suppliers)
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



const updateSupplierDetails: IController = async (req, res) => {
    supplierService.updateSupplierDetails(req.body)
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
        );
    });
};


const formidableUpdateDetails : IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.formidableUpdateDetails(req);
        console.log('Supplier at controller-----> ', supplier);
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
    fetchAllSuppliers,
    fetchSupplierById,
    updateSupplierDetails,
    formidableUpdateDetails
};
