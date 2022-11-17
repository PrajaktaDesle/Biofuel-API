import { AdminModel } from "../Models/Admin/Admin.model";
import LOGGER from "../config/LOGGER";
import moment from 'moment';
import Encryption from "../utilities/Encryption";

const admin_login = async ( data : any ) => {
    try{
        let admin = await new AdminModel().getAdmin( data )
        console.log( "service.admin : ", admin )
        if ( admin.length === 0 ) throw new Error( "Invalid email or password" )
        if ( admin[0].status !== 1 ) throw new Error( "Your account is not active" )
        let login_details : any = {};
        login_details.token = await Encryption.generateJwtToken( { id : admin[0].id })
        login_details.id = admin[0].id
        LOGGER.info( "LOGIN SUCCESSFULL")
        return login_details
    }
    catch(error){
        return error
    }
}
export default {
    admin_login
}