import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getCustomer(mobile:string){
        return await this._executeQuery("select * from user where mobile = ?", [mobile]);
    }
    async createCustomer(customerData:any){
        return await this._executeQuery("insert into user set ?", [customerData]);
    }
  
    async findAllcustomers(){
        return await this._executeQuery("select * from user", []);

    }
    async findCustomerById(id: any ){
        return await this._executeQuery("select * from user where id = ? ", [id]);
    }

    async updateCustomerDetails(data:any){
        return await this._executeQuery("update user set ? where id = ? ", [data, data.id]);
    }
}