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
        return await this._executeQuery("select aadhaar_no, aadhaar_url, pan_no, pan_url, gstin_no, gstin_url, msme_no, msme_url from users_profile where user_id = ? ", [id]);
    }  
    async fetchSuppliersBillingAddressById(id: any){
        return await this._executeQuery("select user_type,address as `billing_address`, pincode, city, latitude, longitude from addresses where user_id = ? and address_type = ? ", [id, "billing"]);
    }
    async fetchSuppliersSourceAddressById(id: any){
        return await this._executeQuery("select address as `source_address` from addresses where user_id = ? and address_type = ? ", [id, "source"]);
    }

    async updateSuppliersProfileDetails(updatedSupplierData:any,id:number){
        return await this._executeQuery("update users_profile set ? where user_id = ? ", [updatedSupplierData,id]);
    }
    async updateSuppliersAddressDetails(updatedSupplierData:any,id:number,a_type:string){
        return await this._executeQuery("update addresses set ? where user_id = ? and address_type = ?", [updatedSupplierData,id,a_type]);
    }

    async createOtp( data : any ){
        return await this._executeQuery( "insert into users_login_logs set ?", [data]);
    }

    async getSupplierOtp( data : any ){
        return await this._executeQuery( "select * from users_login_logs where req_id = ?", [data.request_id])
    }

    async updateTrials( req_id : any, trials : any){
        return await this._executeQuery( "update users_login_logs set trials = ? where req_id = ?", [trials, req_id])
    }

}