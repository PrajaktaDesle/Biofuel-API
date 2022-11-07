import BaseModel from "../BaseModel";
import {Connection} from "mysql2";
import { createECDH } from "crypto";

export class SupplierModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getSupplier(mobile:string){
        return await this._executeQuery("select * from user where mobile = ? ", [mobile]);
    }
    async createSupplier(supplierData:any){
        return await this._executeQuery("insert into user set ?", [supplierData]);
    }
    async createSuppliersProfile(supplierData:any){
        return await this._executeQuery("insert into users_profile set ?", [supplierData]);
    }
    async createSuppliersAddress(supplierData:any){
        return await this._executeQuery("insert into addresses set ?", [supplierData]);
    }
   
   
    async fetchSupplierById(id: any ){
        return await this._executeQuery("select * from user where id = ? ", [id]);
    }
    async fetchSuppliersProfileById(id: any ){
        return await this._executeQuery("select * from users_profile where user_id = ? ", [id]);
    }  
    async fetchSuppliersAddressById(id: any ){
        return await this._executeQuery("select * from addresses where user_id = ? ", [id]);
    }


    async fetchAllSuppliers(){
        return await this._executeQuery("select * from user where role_id = 4 ", []);
    }

    async updateSuppliersDetails(data:any, id : any){
        console.log( data , id )
        return await this._executeQuery("update user set ? where id = ? ", [data, id]);
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