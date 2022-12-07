import BaseModel from "../BaseModel";
import {Connection} from "mysql2";
export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async createCustomer(data:any){
        return await this._executeQuery("insert into customers set ?", [data]);
    }

    async updateCustomer(customerData:any,id:number){
        return await this._executeQuery("update customers set ? where id = ? ", [customerData,id]);
    }

    async fetchCustomerById(id: any ){
        return await this._executeQuery(`SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.payment_term as paymentTerms, cs.status,
                                                max(case when a.address_type = "1" then a.address ELSE null end) as shippingAddress,
                                                max(case when a.address_type = "1" then st.id end) as shipping_state_id,
                                                max(case when a.address_type = "1" then st.name end) as shipping_state,
                                                max(case when a.address_type = "1" then cty.id end) as shipping_city_id,
                                                max(case when a.address_type = "1" then cty.name end) as shipping_city,
                                                max(case when a.address_type = "1" then a.pincode end) as shippingPincode,
                                                max(case when a.address_type = "0" then a.address ELSE null end) as billingAddress,
                                                max(case when a.address_type = "0" then st.id end) as billing_state_id,
                                                max(case when a.address_type = "0" then st.name end) as billing_state,
                                                max(case when a.address_type = "0" then cty.id end) as billing_city_id,
                                                max(case when a.address_type = "0" then cty.name end) as billing_city,
                                                max(case when a.address_type = "0" then a.pincode end) as billingPincode,
                                                cs.created_at, cs.updated_at 
                                                FROM biofuel.customers cs 
                                                LEFT join biofuel.addresses a ON a.user_id=cs.id 
                                                LEFT join biofuel.address_city cty ON a.city_id = cty.id
                                                LEFT join biofuel.address_state st ON cty.state_id = st.id
                                                where cs.id = ?
                                                group by cs.id`,[id])
    }
    async  fetchAllCustomers(limit : number, offset : number, sortOrder : string, query : string){
        return await this._executeQuery(`SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.payment_term as paymentTerms, cs.status,
                                                max(case when a.address_type = "1" then a.address ELSE null end) as shippingAddress,
                                                max(case when a.address_type = "1" then st.id end) as shipping_state_id,
                                                max(case when a.address_type = "1" then st.name end) as shipping_state,
                                                max(case when a.address_type = "1" then cty.id end) as shipping_city_id,
                                                max(case when a.address_type = "1" then cty.name end) as shipping_city,
                                                max(case when a.address_type = "1" then a.pincode end) as shippingPincode,
                                                max(case when a.address_type = "0" then a.address ELSE null end) as billingAddress,
                                                max(case when a.address_type = "0" then st.id end) as billing_state_id,
                                                max(case when a.address_type = "0" then st.name end) as billing_state,
                                                max(case when a.address_type = "0" then cty.id end) as billing_city_id,
                                                max(case when a.address_type = "0" then cty.name end) as billing_city,
                                                max(case when a.address_type = "0" then a.pincode end) as billingPincode,
                                                cs.created_at, cs.updated_at 
                                                FROM biofuel.customers cs 
                                                LEFT join biofuel.addresses a ON a.user_id=cs.id 
                                                LEFT join biofuel.address_city cty ON a.city_id = cty.id
                                                LEFT join biofuel.address_state st ON cty.state_id = st.id
                                                group by cs.id                                       
                                                ${query}
                                                ${sortOrder} 
                                                LIMIT ? OFFSET ? `,[limit, offset])
    }
    async fetchAllCustomerCount(query : string){
        return await this._executeQuery(`SELECT cs.id, cs.name as customer, cs.email, cs.mobile as contact_no,cs.payment_term,cs.status,cs.gstin, cs.gstin_url,a.address as shipping_address,a.address as billing_address,a.latitude, a.longitude, a.user_type,ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode, cs.created_at, cs.updated_at 
                                                   FROM biofuel.customers cs 
                                                   inner join biofuel.addresses a ON a.user_id=cs.id 
                                                   inner join biofuel.address_city ac ON ac.id=a.city_id 
                                                   inner join biofuel.address_state ast ON ac.state_id=ast.id
                                                   ${query} `, [])
    }
    // customer-supplier mapping
    async createCSM(data: any) {
        console.log('data------>', data)
        return await this._executeQuery("insert ignore into customer_supplier_mapping set ? ", [data]);
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
    async fetchAllCustomers_suppliers(limit : number, offset : number, sortOrder : string, query : string){
        return await this._executeQuery(`SELECT customer_id, cs.name as customer, supplier_id, sp.name as supplier,csm.status, csm.created_at , csm.updated_at FROM biofuel.customer_supplier_mapping csm
                                                inner join biofuel.customers cs on cs.id=csm.customer_id
                                                inner join biofuel.user sp on sp.id = csm.supplier_id
                                                ${query}
                                                ${sortOrder}
                                                LIMIT ? OFFSET ? `,[limit, offset])
    }
    async fetch_csm_count(query:string){
        return await this._executeQuery(`SELECT customer_id, cs.name as customer, supplier_id, sp.name as supplier,csm.status, csm.created_at , csm.updated_at FROM biofuel.customer_supplier_mapping csm
                                                inner join biofuel.customers cs on cs.id=csm.customer_id
                                                inner join biofuel.user sp on sp.id = csm.supplier_id
                                                ${query}`,  [])
    }
    async createCustomerEstimate( estimateData : any ){
        return await this._executeQuery( "insert into customer_estimates set ? ", [estimateData] )
    }
    async fetchCustomerEstimateById( id : any){
        return await this._executeQuery( `SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no ,product_id,p.name as product, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, rate, customer_note, adjustment_amount*rate as total_amount FROM biofuel.customer_estimates es
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
    async createCustomerEstimateStagelog( data : any ){
        return await this._executeQuery( "insert into customer_estimate_stage_logs set ? ", [data])
    }
    async createCustomerSalesOrder( data : any ){
        return await this._executeQuery( "insert into customer_sales_orders set ? ", [data])
    }
    async updateCustomerSalesOrder( data : any, id : number ){
        return await this._executeQuery( "update customer_sales_orders set ? where id = ? ", [data, id ])
    }
    async fetchCustomerSalesOrderById( id : number ){
        return await this._executeQuery( `SELECT so.id, customer_id, cs.name as customer,so.status, so_date, delivery_date, estimate_id ,product_id,p.name as product, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, rate,  adjustment_amount*rate as total_amount FROM biofuel.customer_sales_orders so
                                          inner join biofuel.products p ON p.id=so.product_id
                                          inner join biofuel.customers cs ON cs.id=so.customer_id
                                          inner join biofuel.product_raw_material rm ON rm.id=so.raw_material_id
                                          inner join biofuel.product_packaging pp ON pp.id=so.packaging_id
                                          where so.id = ?`, [id])
    }
    async fetchAllCustomerSalesOrders( ){
        return await this._executeQuery( `SELECT so.id, customer_id, cs.name as customer,so.status, so_date, delivery_date, estimate_id ,product_id,p.name as product, product_description, adjustment_amount*rate as total_amount FROM biofuel.customer_sales_orders so
                                          inner join biofuel.products p ON p.id=so.product_id
                                          inner join biofuel.customers cs ON cs.id=so.customer_id`, [])
    }
    async salesOrderExistsOrNot( id : number ){
        return await this._executeQuery( "select id from customer_sales_orders where id = ? ",[id] )
    }
}