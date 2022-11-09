import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class CustomerPOModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getCustomersPOByPoNumber(po_number:string){
        return await this._executeQuery("select * from customer_purchase_order where id = ?", [po_number]);
    }
    async createCustomerPO(customerData:any){
        return await this._executeQuery("insert into customer_purchase_order set ?", [customerData]);
    }
  
    async findAllcustomersPO(){
        return await this._executeQuery("select * from customer_purchase_order", []);

    }
    async findCustomersPO(id: any ){
        return await this._executeQuery("select * from customer_purchase_order where user_id = ? ", [id]);
    }

    async updateCustomerPODetails(data:any){
        return await this._executeQuery("update customer_purchase_order set ? where id = ? ", [data, data.id]);
    }
}