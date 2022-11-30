import UserModel from "../User/User.model";
import {Connection} from "mysql2";

export class CustomerModel extends UserModel
{
    constructor()
    {
        super();
    }
    async createCustomerDetails(data:any){
        return await this._executeQuery("insert into customers set ?", [data]);
    }
    async updateCustomersDetails(customerData:any,id:number){
        return await this._executeQuery("update customers set ? where id = ? ", [customerData,id]);
    }
    async fetchCustomersDetailsById(id: any ){
        return await this._executeQuery(`SELECT cs.id, cs.name as customer, cs.email, cs.mobile as contact_no,cs.payment_term,cs.status,cs.gstin, cs.gstin_url,a.address as shipping_address,a.address as billing_address,a.latitude, a.longitude,a.user_type,ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode,cs.created_at,cs.updated_at
                                         FROM biofuel.customers cs
                                         inner join biofuel.addresses a ON a.user_id=cs.id
                                         inner join biofuel.address_city ac ON ac.id=a.city_id
                                         inner join biofuel.address_state ast ON ac.state_id=ast.id
                                          where a.user_id =? and a.address_type="shipping";`,[id])
    }
    async createCustomerAddress(data:any){
        return await this._executeQuery("insert into addresses set ?", [data]);
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
    async  fetchAllCustomers(){
        return await this._executeQuery("SELECT cs.id, cs.name as customer, cs.email, cs.mobile as contact_no,cs.payment_term,cs.status,cs.gstin, cs.gstin_url,a.address as shipping_address,a.address as billing_address,a.latitude, a.longitude, a.user_type,ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode, cs.created_at, cs.updated_at\n" +
            "                                         FROM biofuel.customers cs\n" +
            "                                         inner join biofuel.addresses a ON a.user_id=cs.id\n" +
            "                                         inner join biofuel.address_city ac ON ac.id=a.city_id\n" +
            "                                         inner join biofuel.address_state ast ON ac.state_id=ast.id;\n",[])
    }
    async fetchsBillingAddressById(user_id: any){
        return await this._executeQuery("select user_type ,address as `billing_address` from addresses where user_id = ? and address_type = ? ", [user_id, "billing"]);
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
    // customer-supplier mapping
    async createCSM(data: any) {
        return await this._executeQuery("insert into customer_supplier_mapping set ? ", [data]);

    }
    async fetchAddressID(customer_id:number){
        return await this._executeQuery("select id, user_type,address as `shipping_address` from addresses where user_id =? and address_type = ? and status = 1", [customer_id, "shipping"])
    }

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

    async createCustomerEstimate( estimateData : any ){
        return await this._executeQuery( "insert into customer_estimates set ? ", [estimateData] )
    }
   
    async fetchCustomerEstimateById( id : any){
        return await this._executeQuery( `SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, adjustment_amount*rate as total_amount FROM biofuel.customer_estimates es
                                          inner join biofuel.products p ON p.id=es.product_id
                                          inner join biofuel.customers cs ON cs.id=es.customer_id
                                          inner join biofuel.product_raw_material rm ON rm.id=es.raw_material_id
                                          inner join biofuel.product_packaging pp ON pp.id=es.packaging_id
                                          where es.id = ?;`, [id] )
    }
    async fetchAllCustomerEstimates(){
        return await this._executeQuery( `SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no , es.id ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, adjustment_amount*rate as total_amount FROM biofuel.customer_estimates es
                                          inner join biofuel.products p ON p.id=es.product_id
                                          inner join biofuel.customers cs ON cs.id=es.customer_id
                                          inner join biofuel.product_raw_material rm ON rm.id=es.raw_material_id
                                          inner join biofuel.product_packaging pp ON pp.id=es.packaging_id
                                          order by es.status desc`, [] )
    }
    async updateCustomerEstimateById( data : any, id : number ){
        return await this._executeQuery( "update customer_estimates set ? where id = ? ",[data,id] )
    }
    async estimateExistsOrNot( id : number ){
        return await this._executeQuery( "select id from customer_estimates where id = ? ",[id] )
    }
   
}