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
        return await this._executeQuery("select * from supplier where mobile = ? ", [mobile]);
    }
    async createSupplier(supplierData:any){
        return await this._executeQuery("insert into supplier set ?", [supplierData]);
    }
   
    async fetchAllSuppliers(){
        return await this._executeQuery("select * from supplier ", []);
    }
    async fetchSupplierById(id: any ){
        return await this._executeQuery("select * from supplier where id = ? ", [id]);
    }

    async updateSupplierDetails(data:any){
        return await this._executeQuery("update supplier set ? where id = ? ", [data, data.id]);
    }

    async formidableUpdateDetails(updatedSupplierData:any,id:number){
        return await this._executeQuery("update supplier set ? where id = ? ", [updatedSupplierData,id]);
    }

    async createOtp( data : any ){
        return await this._executeQuery( "insert into supplier_login set ?", [data]);
    }

    async getSupplierOtp( data : any ){
        return await this._executeQuery( "select * from supplier_login where req_id = ?", [data.request_id])
    }

    async updateTrials( req_id : any, trials : any){
        return await this._executeQuery( "update supplier_login set trials = ? where req_id = ?", [trials, req_id])
    }

}