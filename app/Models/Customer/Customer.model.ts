import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getCustomer(mobile:string){
        return await this._executeQuery("select * from customer where mobile = ?", [mobile]);
    }
    async createCustomer(customerData:any){
        return await this._executeQuery("insert into customer set ?", [customerData]);
    }
  
    async findAllcustomers(){
        return await this._executeQuery("select * from customer", []);

    }
    async findCustomerById(id: any ){
        return await this._executeQuery("select * from customer where id = ? ", [id]);
    }

    async updateCustomerDetails(data:any){
        return await this._executeQuery("update customer set ? where id = ? ", [data, data.id]);
    }
}