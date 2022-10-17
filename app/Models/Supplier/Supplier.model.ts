import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class SupplierModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getSupplier(mobile:string){
        return await this._executeQuery("select * from customers where mobile = ? ", [mobile]);
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
}