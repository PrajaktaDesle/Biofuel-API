import UserModel from "../User/User.model";
import {Connection} from "mysql2";
import { createECDH } from "crypto";

export class SupplierModel extends UserModel
{
    constructor()
    {
        super();
    }
   
    async createSuppliersProfile(supplierData:any){
        return await this._executeQuery("insert into users_profile set ?", [supplierData]);
    }
    async createSuppliersAddress(supplierData:any){
        return await this._executeQuery("insert into addresses set ?", [supplierData]);
    }
   
    async fetchSuppliersProfileById(id: any ){
        return await this._executeQuery("select aadhaar_no, aadhaar_img, pan_no, pan_img, gstin_no, gstin_img, latitude, longitude from users_profile where user_id = ? ", [id]);
    }  
    async fetchSuppliersAddressById(id: any ){
        return await this._executeQuery("select address, pincode, city from addresses where user_id = ? ", [id]);
    }

    async updateSuppliersProfileDetails(updatedSupplierData:any,id:number){
        return await this._executeQuery("update users_profile set ? where user_id = ? ", [updatedSupplierData,id]);
    }
    async updateSuppliersAddressDetails(updatedSupplierData:any,id:number){
        return await this._executeQuery("update addressses set ? where user_id = ? ", [updatedSupplierData,id]);
    }

    async createOtp( data : any ){
        return await this._executeQuery( "insert into users_login set ?", [data]);
    }

    async getSupplierOtp( data : any ){
        return await this._executeQuery( "select * from users_login where req_id = ?", [data.request_id])
    }

    async updateTrials( req_id : any, trials : any){
        return await this._executeQuery( "update users_login set trials = ? where req_id = ?", [trials, req_id])
    }

}