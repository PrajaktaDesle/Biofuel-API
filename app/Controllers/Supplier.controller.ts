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
        LOGGER.info('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
            supplier,
            httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
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
            LOGGER.info( "Controller Error : ", supplier.message )
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
        LOGGER.info("Controller Error : ", err);
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
    try{
        let query = " "
        if(req.body.query != ""){
            query = ` and  u.name like '%${req.body.query}%' or u.contact_no like '%${req.body.query}' `
        }
        let suppliers = await supplierService.fetchAllSuppliers(req.body.pageIndex, req.body.pageSize, req.body.sort, query)
        let count = await supplierService.fetchAllSuppliersCount(query);
        if ( suppliers instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    suppliers.message )
        }
        else{
           return apiResponse.result( res,
               {data :suppliers, total : count},
               httpStatusCodes.OK )
        }

    }
    catch (error:any) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
};


const fetchSupplierById: IController = async (req, res) => {
    supplierService.fetchSupplierById(req.query.id)
        .then( (supplier : any) => {
            if(supplier instanceof Error){
                LOGGER.info("User 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                LOGGER.log("User 3", supplier)
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};





const updateSupplierDetails : IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.updateSupplierDetails(req);
        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.CREATED);
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


const getHomePage: IController = async (req, res) => {
    try {
        let homePage : any = await supplierService.getHomePage();
        if (homePage instanceof Error) {
            LOGGER.info("error", homePage)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, homePage, httpStatusCodes.OK);
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

const fetchAllSuppliersByState: IController = async (req, res) => {
    try{
        let suppliers = await supplierService.fetchSuppliersByState(req)
        if ( suppliers instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                suppliers.message )
        }
        else{
            return apiResponse.result( res,
                 suppliers,
                httpStatusCodes.OK )
        }
    }
    catch (error:any) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST ,error.message)
    }
};

// fetchAllSupplierPO
const fetchAllSupplierPO: IController = async (req, res) => {
    try{
        let query = " "
        if(req.body.query != ""){
            query = ` where s.name like '%${req.body.query}%' or c.name like '%${req.body.query}' `
        }
        let suppliers = await supplierService.fetchAllSupplierPO(req.body.pageIndex, req.body.pageSize, req.body.sort, query)
        let count = await supplierService.fetchAllSupplierPOCount(query);
        if ( suppliers instanceof Error ){
           return apiResponse.error( res,
                                    httpStatusCodes.BAD_REQUEST,
                                    suppliers.message )
        }
        else{
           return apiResponse.result( res,
               {data :suppliers, total : count},
               httpStatusCodes.OK )
        }

    }
    catch (error:any) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
                                  httpStatusCodes.BAD_REQUEST )
    }
};

const updateSupplierPO : IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.updateSupplierPO(req.body);
        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.CREATED);
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

const fetchAllSuppliersList : IController = async (req, res) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " AND u.name like '%"+ req.query.key + "%'" : "";
        let supplier : any = await supplierService.fetchAllSuppliersList(query);
        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.OK);
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
const createSupplierPO : IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.createSupplierPO(req.body);
        LOGGER.info('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
            supplier,
            httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
        // @ts-ignore
       
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
        return;
    }
};
const  createChallan : IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.createChallanService(req.body);
        LOGGER.info('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
                supplier,
                httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
        // @ts-ignore

        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;
    }
};

const fetchSupplierPOById: IController = async (req, res) => {
    supplierService.fetchSupplierPOById(req.query.id)
        .then( (supplier : any) => {
            if(supplier instanceof Error){
                LOGGER.info("User 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                LOGGER.log("User 3", supplier)
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};

const fetchSupplierPOBySupplierId: IController = async (req, res) => {
    supplierService.fetchSupplierPOBySupplierId(req.query.id)
        .then( (supplier : any) => {
            if(supplier instanceof Error){
                LOGGER.info("User 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                LOGGER.log("User 3", supplier)
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
        );
    });
};
const fetchAllChallan: IController = async (req, res) => {
    try{
        let query = " "
        if(req.body.query != ""){
            query = ` where dc.dispatch_id like '%${req.body.query}%' or dc.vehicle_no like '%${req.body.query}%' or sp.name like '%${req.body.query}%' or cs.name like '%${req.body.query}%' `
        }
        let suppliers = await supplierService.fetchAllDeliveryChallan(req.body.pageIndex, req.body.pageSize, req.body.sort, query)
        let count = await supplierService.fetchAllChallansCount(query);
        if ( suppliers instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                suppliers.message )
        }
        else{
            return apiResponse.result( res,
                {data :suppliers, total : count},
                httpStatusCodes.OK)
        }

    }
    catch (error:any) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST, error.message )
    }
};
const  updatechallan: IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.updateChallanServcie(req);
        LOGGER.info('Supplier at controller-----> ', supplier);
        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
                supplier,
                httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
        // @ts-ignore

        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;
    }
};
const  addSupplierPayment : IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.addsupplierPaymentService(req.body);
        LOGGER.info('Supplier at controller-----> ', supplier);

        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
                supplier,
                httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
        // @ts-ignore

        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;
    }
};
// fetch all approved challan for payment
const getAllPayments: IController = async (req, res) => {
    try{
        let query = " "
        if(req.body.query != ""){
            query = ` and  sp.name like '%${req.body.query}%' or sp.mobile like '%${req.body.query}%' `
        }
        let payment = await supplierService.fetchPaymentsDetails(req.body.pageIndex, req.body.pageSize, req.body.sort, query)
        let count = await supplierService.fetchAllPaymentsCount(query);
        if ( payment instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                payment.message )
        }
        else{
            return apiResponse.result( res,
                {data :payment, total : count},
                httpStatusCodes.OK )
        }

    }
    catch (error:any) {
        LOGGER.info( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST,
            error.message)
    }
};
const  updatesupplierPayment: IController = async (req, res) => {
    supplierService.updateSupplierPayment(req.body)
        .then( ( supplier : any) => {
            if(supplier instanceof Error){
                LOGGER.info("User 2", supplier.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    supplier.message
                );
            }else{
                apiResponse.result(res, supplier, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            err.message
        );
    });
};

const  fetchAllNotificationsBySupplierID: IController = async (req, res) => {
    supplierService.fetchAllNotificationsBySupplierId(req)
        .then( ( result : any) => {
            if( result instanceof Error){
                LOGGER.info("User 2", result.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    result.message
                );
            }else{
                apiResponse.result(res, result, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            err.message
        );
    });
};
const  fetchAllPaymentsBySupplierID: IController = async (req, res) => {
    supplierService.fetchAllPaymentsBySupplierId(req)
        .then( ( result : any) => {
            if( result instanceof Error){
                LOGGER.info("User 2", result.message)
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    result.message
                );
            }else{
                apiResponse.result(res, result, httpStatusCodes.OK);
            }
        }).catch( (err : any) => {
        LOGGER.info("Error  ->", err);
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            err.message
        );
    });
};

const  addSupplierSection : IController = async (req, res) => {
    let supplier: any;
    try {
        supplier = await supplierService.addSupplierSection(req.body);
        LOGGER.info('Supplier selection at controller-----> ', supplier);

        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,
                supplier,
                httpStatusCodes.CREATED);
        }

    } catch (e:any) {
        LOGGER.info("controller ->", e)
        // @ts-ignore

        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;
    }
};

const updateSupplierSelection : IController = async (req, res) => {
    try {
        let supplier : any = await supplierService.updateSupplierSelection(req.body);
        if (supplier instanceof Error) {
            LOGGER.info("error", supplier)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, supplier, httpStatusCodes.CREATED);
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

const supplierPONoExistsOrNot: IController = async (req, res) => {
    await supplierService.supplierPONoExistsOrNot(req)
        .then((customer: any) => {
            if (customer instanceof Error) {
                apiResponse.error(
                    res,
                    httpStatusCodes.BAD_REQUEST,
                    customer.message
                );
            } else {
                apiResponse.result(res, customer, httpStatusCodes.OK);
            }
        }).catch((err: any) => {
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                err.message
            );
        });
};
export default {
    register,
    login,
    verify_otp,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSupplierDetails,
    getHomePage,
    fetchAllSuppliersByState,
    fetchAllSupplierPO,
    updateSupplierPO,
    fetchAllSuppliersList,
    createSupplierPO,
    fetchSupplierPOById,
    fetchAllChallan,
    createChallan,
    updatechallan,
    fetchSupplierPOBySupplierId,
    addSupplierPayment,
    getAllPayments,
    updatesupplierPayment,
    addSupplierSection,
    updateSupplierSelection,
    fetchAllNotificationsBySupplierID,
    fetchAllPaymentsBySupplierID,
    supplierPONoExistsOrNot

};
