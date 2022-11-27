import IController from "../Types/IController";
import apiResponse from "../utilities/ApiResponse";
import httpStatusCodes from "http-status-codes";
import constants from "../Constants";
import service from "../Services/customer_supplier_mapping.service"
import productService from "../Services/Product.service";
import customer_supplier_mappingService from "../Services/customer_supplier_mapping.service";

const CreateCustSuppMapping: IController = async (req, res) => {
    let CSM: any;
    try {
        CSM = await service.CreateCSMService(req) ;
        if (CSM instanceof Error) {
            console.log("error", CSM)
            apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST );
        }
        else {
            apiResponse.result( res,
                CSM,
                httpStatusCodes.CREATED );
        }

    } catch (e:any) {
        console.log("controller ->", e)
        // @ts-ignore
        if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
            apiResponse.error(res,
                httpStatusCodes.BAD_REQUEST)
        } else {
            apiResponse.error(res,
                httpStatusCodes.BAD_REQUEST)
        }
        return;
    }
};
const updateCSMStatus:IController = async ( req, res) => {
    let  result:any
    try{
        result = await customer_supplier_mappingService.updateCSMService(req)
        if(result instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                result.message )
        }
        else{
            return apiResponse.result( res,
                 result,
                httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST,
            error.message)
    }
}
const fetchAll_customers_suppliers:IController = async ( req:any , res:any ) => {
    try{
        let result = await customer_supplier_mappingService.fetchAllCSM()
        if ( result instanceof Error ){
            return apiResponse.error( res,
                httpStatusCodes.BAD_REQUEST,
                result.message )
        }
        else{
            return apiResponse.result( res,
                result,
                httpStatusCodes.OK )
        }
    }
    catch ( error : any ) {
        console.log( "Error => ", error )
        return apiResponse.error( res,
            httpStatusCodes.BAD_REQUEST )
    }
}

export default {CreateCustSuppMapping, updateCSMStatus, fetchAll_customers_suppliers}