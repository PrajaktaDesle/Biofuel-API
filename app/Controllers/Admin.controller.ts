import ApiResponse from "../utilities/ApiResponse";
import httpStatusCodes  from 'http-status-codes';
import IController from "../Types/IController";
import adminService from "../Services/Admin.service";

const login : IController = async (req : any, res : any) => {
    try{
        console.log( "Admin login data : ", req.body )
        let admin : any = await adminService.admin_login( req.body );
        console.log( "Admin login data : ", admin )
        if ( admin instanceof Error ){
            console.log( "Controller Error : ", admin.message )
            ApiResponse.error( res,
                               httpStatusCodes.BAD_REQUEST,
                               admin.message );
        }
        else{
            ApiResponse.result( res, 
                               admin,
                               httpStatusCodes.CREATED )
        }
    }
    catch( error ){
        console.log( "Controller Error : ", error )
        ApiResponse.error( res, 
                           httpStatusCodes.BAD_REQUEST )
    }
}
export default {
    login
}