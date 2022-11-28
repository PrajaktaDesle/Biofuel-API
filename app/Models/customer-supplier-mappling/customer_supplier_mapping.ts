import BaseModel from "../BaseModel";
import {Connection} from "mysql2";
export default class Customer_supplier_mapping_model extends BaseModel {
    constructor() {
        super();
    }

    async createCSM(data: any) {
        return await this._executeQuery("insert into customer_supplier_mapping set ? ", [data]);
        //  let query = await this._executeQuery("insert into customer_supplier_mapping WHERE NOT EXISTS (select customer_id, supplier_id from customer_supplier_mapping where customer_id = ? and supplier_id = ?) set ? ", [data])
        // let query = "insert into customer_supplier_mapping  where not exists(select customer_id, supplier_id from customer_supplier_mapping where customer_id =? and supplier_id =?) set ? "

    }
    async fetchAddressID(customer_id:number){
        return await this._executeQuery("select id, user_type,address as `shipping_address` from addresses where user_id =? and address_type = ? and status = 1", [customer_id, "shipping"])
    }
    // async fetchSupplierAddress(supplier_id:number){
    //     console.log('in model-------->', supplier_id)
    //     let query = await this._executeQuery("select id, user_type, status,address as `source_address` from addresses where user_id =? and address_type = ?", [supplier_id, "source"])
    //     console.log(' model supplier address -------->', query)
    //     return query
    // }
    async fetchSupplier(supplier_id:number){
         return await this._executeQuery("select * from user where id = ? and status = 1 and role_id = 3", [supplier_id])
    }
    async fetchCustomers(customer_id:number){
        return await this._executeQuery("select * from customers where id = ? and status = 1", [customer_id])
    }
    async fetchCSMById(id:any){
        return await this._executeQuery("select * from customer_supplier_mapping where id = ? ", [id])
    }
    async updateStatusById(data : any, customer_id:number, supplier_id:number){
        return await this._executeQuery( "update customer_supplier_mapping set ? where  customer_id  = ? and supplier_id = ? ",[data,customer_id,supplier_id] )
    }
    async fetchCSM(customer_id:any, supplier_id:any){
        return await this._executeQuery("select * from customer_supplier_mapping where customer_id = ? and supplier_id = ? ", [customer_id, supplier_id])
    }
    async fetchAll(){
        return await this._executeQuery("select * from customer_supplier_mapping where status = 1 ", [])
    }
    async fetchCity(address_id:number){
        return await this._executeQuery("select id, city_id ,address from addresses where id = ?", [address_id])
    }
    async fetchCustomerCity(city_id:any){
        return await this._executeQuery("select name from address_city where id = ?", [city_id]);
    }

}