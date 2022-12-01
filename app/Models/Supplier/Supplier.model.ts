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
   
    async fetchSupplierById(id: any ){
        return await this._executeQuery(`SELECT u.id, u.name, u.mobile as contact_no, up.aadhaar_no, up.aadhaar_url, up.pan_no, up.pan_url, up.gstin, up.gstin_url, up.msme_no, up.msme_url, a.address as source_address, up.grade, up.payment_term , act.id as city_id , act.name as city, act.state_id, ast.name as state, a.pincode, a.latitude, a.longitude, u.status
                                         FROM biofuel.user u
                                         inner join biofuel.users_profile up ON u.id=up.user_id
                                         inner join biofuel.addresses a ON u.id=a.user_id
                                         inner join biofuel.address_city act ON act.id=a.city_id
                                         inner join biofuel.address_state ast ON act.state_id=ast.id
                                         where u.id = ? and a.address_type = "source";`, [id]);
    }  

    async fetchSuppliersBillingAddressById(id: any){
        return await this._executeQuery("select user_type,address as `billing_address` from addresses where user_id = ? and address_type = 'billing' ", [id]);
    }
    
    async fetchAllSuppliers(){
        return await this._executeQuery(`SELECT u.id, u.name, case when up.grade = 1 then 'A' when up.grade = 2 then 'B' when up.grade = 3 then 'C' when up.grade = 4 then 'D' else null end as grade, u.mobile as contact_no, a.address, act.name as city, a.pincode, a.latitude, a.longitude, u.status FROM biofuel.user u
                                         inner join biofuel.users_profile up ON u.id=up.user_id 
                                         inner join biofuel.addresses a ON u.id=a.user_id 
                                         inner join biofuel.address_city act ON act.id=a.city_id 
                                         where a.address_type = 'source' `, [])
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
     
    async supplierPackagingMapping( data : any){
        return await this._executeQuery( "insert into supplier_packaging_mapping set ?", [data])
    }

    async getHomePage(){
        return await this._executeQuery( "select id , name, image_url from app_homepage ",[])
    }

}