import BaseModel from "../BaseModel";
import {Connection} from "mysql2";
export default class Customer extends BaseModel {
    constructor()
    {
        super();
    }
    async createModel(data:any){
        return await this._executeQuery("insert into customers set ?", [data]);
    }
    async updateCustomersDetails(customerData:any,id:number){
        return await this._executeQuery("update customers set ? where id = ? ", [customerData,id]);
    }
    async fetchCustomersDetailsById(id: any ){
        return await this._executeQuery("select * from customers where id = ? ", [id]);
    }
    async createCustomerAddress(data:any){
        return await this._executeQuery("insert into addresses set ?", [data]);
    }
    async fetchCustomerCity(data:any){
        return await this._executeQuery("select id,name from address_city where name = ?", [data]);
    }
    async fetchCustomerState(data:any){
        return await this._executeQuery("select id,name from address_state where name = ?", [data]);
    }
    async fetchCustomerAddress(user_id:number){
        return await this._executeQuery("select * from addresses where user_id = ?", [user_id]);
    }
    async updateCustomersAddress(customerData:any,user_id:number, add_type:string){
        return await this._executeQuery("update addresses set ? where user_id = ?  and address_type = ? ", [customerData,user_id, add_type]);
    }
    async updateCustomerStatus(data:any, id:number){
        return await this._executeQuery("update customers set ? where id = ? ", [data, id]);
    }
    async updateCustomerAddressStatus(data:any, user_id:number){
        delete data.id
        return await this._executeQuery("update addresses set ? where user_id = ? ", [data, user_id]);
    }
    async  fetchAllCustomers(){
        return await this._executeQuery("select * from  customers", []);
    }
    async fetchsBillingAddressById(user_id: any){
        return await this._executeQuery("select user_type,address as `billing_address` from addresses where user_id = ? and address_type = ? ", [user_id, "billing"]);
    }
    async fetchShippingAddressById(id: any){
        return await this._executeQuery("select address as `shipping_address`,pincode, city_id, latitude, longitude from addresses where user_id = ? and address_type = ? ", [id, "shipping"]);
    }
    async getCityById(id:number){
        return await this._executeQuery( "select * from address_city where id = ? ",[id])
    }
    async getStateById(id:number){
        return await this._executeQuery( "select * from address_state where id = ? ",[id])
    }
}
