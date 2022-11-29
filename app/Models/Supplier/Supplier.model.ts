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
   
    async fetchSuppliersProfileAndSourceAddressById(id: any ){
        return await this._executeQuery(`SELECT up.aadhaar_no, up.aadhaar_url, up.pan_no, up.pan_url, up.gstin, up.gstin_url, up.msme_no, up.msme_url,a.address as source_address, a.latitude, a.longitude, ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode, a.status 
                                         FROM biofuel.users_profile up
                                         inner join biofuel.addresses a ON a.user_id=up.user_id
                                         inner join biofuel.address_city ac ON ac.id=a.city_id
                                         inner join biofuel.address_state ast ON ac.state_id=ast.id
                                         where a.user_id=? and a.address_type="source";`, [id]);
    }  

    async fetchSuppliersBillingAddressById(id: any){
        return await this._executeQuery("select user_type,address as `billing_address` from addresses where user_id = ? and address_type = ? ", [id, "billing"]);
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

    async supplierRawMaterialMapping( data : any){
        return await this._executeQuery( "insert into supplier_raw_material_mapping set ?", [data])
    }

    async getCity(name:string){
        return await this._executeQuery( "select id from address_city where name = ? ",[name])
    }
    async getCityStateById(id:number){
        return await this._executeQuery( `SELECT ac.name as city, ac.state_id, a.name as state FROM biofuel.address_city ac
                                          inner join biofuel.address_state a ON ac.state_id=a.id
                                          where ac.id = ?`,[id] )
    }
    async getStateById(id:number){
        return await this._executeQuery( "select * from address_state where id = ? ",[id])
    }
    async getState(name:string){
        return await this._executeQuery( "select id from address_state where name = ?",[name])
    }
     
  
    async supplierPackagingMapping( data : any){
        return await this._executeQuery( "insert into supplier_packaging_mapping set ?", [data])
    }

    async getHomePage(){
        return await this._executeQuery( "select id , name, image_url from app_homepage ",[])
    }

}