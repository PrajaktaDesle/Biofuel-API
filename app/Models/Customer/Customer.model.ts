import BaseModel from "../BaseModel";
import { Connection } from "mysql2";
export class CustomerModel extends BaseModel {
    constructor() {
        super();
    }
    async createCustomer(data: any) {
        return await this._executeQuery("insert into customers set ?", [data]);
    }

    async updateCustomer(customerData: any, id: number) {
        return await this._executeQuery("update customers set ? where id = ? ", [customerData, id]);
    }

    async fetchCustomerById(id: any) {
        return await this._executeQuery(`SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.gstin_url as gstin_img, cs.payment_term as paymentTerms, cs.status,
                                                max(case when a.address_type = "0" then a.address ELSE null end) as shippingAddress,
                                                max(case when a.address_type = "0" then st.id end) as shipping_state_id,
                                                max(case when a.address_type = "0" then st.name end) as shipping_state,
                                                max(case when a.address_type = "0" then cty.id end) as shipping_city_id,
                                                max(case when a.address_type = "0" then cty.name end) as shipping_city,
                                                max(case when a.address_type = "0" then a.pincode end) as shippingPincode,
                                                max(case when a.address_type = "1" then a.address ELSE null end) as billingAddress,
                                                max(case when a.address_type = "1" then st.id end) as billing_state_id,
                                                max(case when a.address_type = "1" then st.name end) as billing_state,
                                                max(case when a.address_type = "1" then cty.id end) as billing_city_id,
                                                max(case when a.address_type = "1" then cty.name end) as billing_city,
                                                max(case when a.address_type = "1" then a.pincode end) as billingPincode,
                                                cs.created_at, cs.updated_at 
                                                FROM customers cs 
                                                LEFT join addresses a ON a.user_id=cs.id 
                                                LEFT join address_city cty ON a.city_id = cty.id
                                                LEFT join address_state st ON cty.state_id = st.id
                                                where cs.id = ?
                                                group by cs.id`, [id])
    }
    async fetchAllCustomers(limit: number, offset: number, sortOrder: string, query: string) {
        return await this._executeQuery(`SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.payment_term as paymentTerms, cs.status,
                                                max(case when a.address_type = "0" then a.address ELSE null end) as shippingAddress,
                                                max(case when a.address_type = "0" then st.id end) as shipping_state_id,
                                                max(case when a.address_type = "0" then st.name end) as shipping_state,
                                                max(case when a.address_type = "0" then cty.id end) as shipping_city_id,
                                                max(case when a.address_type = "0" then cty.name end) as shipping_city,
                                                max(case when a.address_type = "0" then a.pincode end) as shippingPincode,
                                                max(case when a.address_type = "1" then a.address ELSE null end) as billingAddress,
                                                max(case when a.address_type = "1" then st.id end) as billing_state_id,
                                                max(case when a.address_type = "1" then st.name end) as billing_state,
                                                max(case when a.address_type = "1" then cty.id end) as billing_city_id,
                                                max(case when a.address_type = "1" then cty.name end) as billing_city,
                                                max(case when a.address_type = "1" then a.pincode end) as billingPincode,
                                                cs.created_at, cs.updated_at 
                                                FROM customers cs 
                                                LEFT join addresses a ON a.user_id=cs.id 
                                                LEFT join address_city cty ON a.city_id = cty.id
                                                LEFT join address_state st ON cty.state_id = st.id
                                                ${query}
                                                group by cs.id                                                                                  
                                                ${sortOrder} 
                                                LIMIT ? OFFSET ? `, [limit, offset])
    }
    async fetchAllCustomerCount(query: string) {
        return await this._executeQuery(`SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo ,cs.payment_term,cs.status,cs.gstin, cs.gstin_url,a.address as shipping_address,a.address as billing_address,a.latitude, a.longitude, a.user_type,ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode, cs.created_at, cs.updated_at 
                                                   FROM customers cs 
                                                   left join addresses a ON a.user_id=cs.id 
                                                   left join address_city ac ON ac.id=a.city_id 
                                                   left join address_state ast ON ac.state_id=ast.id
                                                   ${query} 
                                                   group by cs.id`, [])
    }
    // customer-supplier mapping
    async createCSM(data: any) {
        return await this._executeQuery("insert ignore into customer_supplier_mapping set ? ", [data]);
    }
    async createCustomerSupplierMapping(customer_id: number, supplier_id: number) {
        return await this._executeQuery(`INSERT INTO customer_supplier_mapping(customer_id,address_id,supplier_id)
                                                        select a.user_id as customer_id, a.id as address_id,sp.id as supplier_id
                                                        from user as sp, addresses as a
                                                        where (a.user_id = ? and address_type = 0 and user_type = 0) and (sp.id = ? and role_id = 3);
                                                         `, [customer_id, supplier_id])
    }
    async updateStatusById(id:number, status:number) {
         return await this._executeQuery("update customer_supplier_mapping set status = ? where id = ? ", [status, id])
    }
    async fetchCSM(id:number) {
        return await this._executeQuery("select * from customer_supplier_mapping where id = ? ", [id])
    }
    async fetchAllCustomerSuppliers(limit: number, offset: number, sortOrder: string, query: string) {
        // return await this._executeQuery(`SELECT csm.id, customer_id, cs.name as customer,FLOOR((count(csm.supplier_id)/2)) as supplier, case when a.address_type=0 then ast.name ELSE null end as state FROM customer_supplier_mapping csm
        return await this._executeQuery(`SELECT csm.id, customer_id, cs.name as customer,count(csm.supplier_id) as supplier, ast.name as state FROM customer_supplier_mapping csm
                                         inner join customers cs on cs.id=csm.customer_id
                                         inner join addresses a ON csm.customer_id=a.user_id and a.address_type = 0
                                         inner join address_city ac ON ac.id=a.city_id 
                                         inner join address_state ast ON ac.state_id=ast.id
                                         where csm.status  = 1 ${query}
                                         group by csm.customer_id
                                         ${sortOrder}
                                         LIMIT ? OFFSET ? `, [limit, offset])
    }
    async fetchAllMappedSuppliers(customer_id: number) {
        return await this._executeQuery(`SELECT  supplier_id, sp.name as supplier,csm.status, ast.name as state, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                         inner join customers cs on cs.id=csm.customer_id
                                         inner join user sp on sp.id = csm.supplier_id
                                         inner join addresses a ON sp.id=a.user_id and a.address_type = 2
                                         inner join address_city ac ON ac.id=a.city_id 
                                         inner join address_state ast ON ac.state_id=ast.id
                                         where csm.customer_id = ? and csm.status = 1 
                                         group by csm.supplier_id`
            , [customer_id])
    }
    async fetch_csm_count(query: string) {
        return await this._executeQuery(`SELECT customer_id, cs.name as customer, supplier_id, sp.name as supplier,csm.status, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                                inner join customers cs on cs.id=csm.customer_id
                                                inner join user sp on sp.id = csm.supplier_id
                                                ${query}`, [])
    }
    async createCustomerEstimate(estimateData: any) {
        return await this._executeQuery("insert into customer_estimates set ? ", [estimateData])
    }
    async fetchCustomerEstimateById(id: any) {
        return await this._executeQuery(`SELECT es.id, customer_id, cs.name as customer,es.status,  DATE_FORMAT(estimate_date, '%Y-%m-%d') as estimate_date, DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiry_date, estimate_no, es.raw_material_id, prm.name as raw_material ,product_id,p.name as product, product_description, packaging_id, pp.name as packaging, quantity, rate, adjustment_amount as adjustment,tnc, customer_note, adjustment_amount+(rate*quantity) as total_amount
                                          FROM customer_estimates es
                                          inner join products p ON p.id=es.product_id
                                          inner join customers cs ON cs.id=es.customer_id
                                          inner join product_raw_material prm ON prm.id=es.raw_material_id
                                          inner join product_packaging pp ON pp.id=es.packaging_id
                                          where es.id = ? `, [id])
    }
    async fetchAllCustomerEstimates(limit: number, offset: number, sortOrder: string, query: string) {
        return await this._executeQuery(`SELECT es.id, customer_id, cs.name as customer,es.status, DATE_FORMAT(estimate_date, '%d-%m-%Y')  as estimate_date ,DATE_FORMAT(expiry_date, '%d-%m-%Y')  as expiry_date , estimate_no , es.id ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, adjustment_amount+(rate*quantity) as total_amount FROM customer_estimates es
                                          inner join products p ON p.id=es.product_id
                                          inner join customers cs ON cs.id=es.customer_id
                                          inner join product_raw_material rm ON rm.id=es.raw_material_id
                                          inner join product_packaging pp ON pp.id=es.packaging_id
                                          ${query}
                                          ${sortOrder} 
                                          LIMIT ? OFFSET ?`, [limit, offset])
    }
    async updateCustomerEstimateById(data: any, id: number) {
        return await this._executeQuery("update customer_estimates set ? where id = ? ", [data, id])
    }
    async estimateExistsOrNot(id: number) {
        return await this._executeQuery("select id from customer_estimates where id = ? ", [id])
    }
    async createCustomerEstimateStagelog(data: any) {
        return await this._executeQuery("insert into customer_estimate_stage_logs set ? ", [data])
    }
    async createCustomerSalesOrder(data: any) {
        return await this._executeQuery("insert into customer_sales_orders set ? ", [data])
    }
    async updateCustomerSalesOrder(data: any, id: number) {
        return await this._executeQuery("update customer_sales_orders set ? where id = ? ", [data, id])
    }
    async fetchCustomerSalesOrderById(id: number) {
        
        return await this._executeQuery(`SELECT so.id, customer_id, cs.name as customer,so.status,sales_order_no, DATE_FORMAT(so_date, '%Y-%m-%d') as so_date,  DATE_FORMAT(delivery_date, '%Y-%m-%d') as delivery_date, estimate_id ,product_id,p.name as product, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, rate, quantity, adjustment_amount,  (quantity*rate)+adjustment_amount as total_amount FROM customer_sales_orders so
                                          inner join products p ON p.id=so.product_id
                                          inner join customers cs ON cs.id=so.customer_id
                                          inner join product_raw_material rm ON rm.id=so.raw_material_id
                                          inner join product_packaging pp ON pp.id=so.packaging_id
                                          where so.id = ?`, [id])
    }
    async fetchAllCustomerSalesOrders(limit: number, offset: number, sortOrder: string, query: string) {
        return await this._executeQuery(`SELECT so.id, customer_id, cs.name as customer,so.status, DATE_FORMAT(so_date, '%d-%m-%Y')  as so_date, DATE_FORMAT(delivery_date, '%d-%m-%Y') as delivery_date, estimate_id ,product_id,p.name as product, product_description, (quantity*rate)+adjustment_amount as total_amount, sales_order_no FROM customer_sales_orders so
                                          inner join products p ON p.id=so.product_id
                                          inner join customers cs ON cs.id=so.customer_id
                                          ${query}
                                          ${sortOrder} 
                                          LIMIT ? OFFSET ? `, [limit, offset])

    }
    async salesOrderExistsOrNot(id: number) {
        return await this._executeQuery("select id from customer_sales_orders where id = ? ", [id])
    }
    // async fetchAllCustomerEstimatesCount(query: string) {
    async fetchALLActiveCustomers(){
       return await this._executeQuery(`select a.id as value ,
                                               concat(cs.name ,', ', ac.name) as label
                                               from addresses a
                                               inner join customers cs on a.user_id = cs.id 
                                               inner join biofuel.address_city ac on a.city_id = ac.id
                                               where a.user_type = 0 and a.address_type = 0 and cs.status = 1;
                                               `,[])
    }
    async fetchAllmappedSuppliersByAddressId(address_id :number){
        return await this._executeQuery(`select csm.supplier_id ,sp.name as supplier,ac.name as city, ast.name as state,
                                                csm.status, csm.created_at, csm.updated_at
                                                from customer_supplier_mapping csm
                                                inner join addresses a on csm.supplier_id = a.user_id 
                                                inner join user sp on a.user_id = sp.id
                                                inner join address_city ac on a.city_id = ac.id and a.address_type = 1
                                                inner join address_state ast on ac.state_id = ast.id
                                                where csm.address_id = ? and csm.status = 1
                                                `,[address_id])
    }
    async fetchAllCustomerEstimatesCount(query:string) {
        return await this._executeQuery(`SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no , es.id ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, adjustment_amount*rate as total_amount FROM customer_estimates es
        inner join products p ON p.id=es.product_id
        inner join customers cs ON cs.id=es.customer_id
        inner join product_raw_material rm ON rm.id=es.raw_material_id
        inner join product_packaging pp ON pp.id=es.packaging_id
        ${query}
        `, [])

    }
    async fetchAllCustomerSalesOrdersCount(query: string) {
        return await this._executeQuery(`SELECT so.id, customer_id, cs.name as customer,so.status, so_date, delivery_date, estimate_id ,product_id,p.name as product, product_description, adjustment_amount*rate as total_amount FROM customer_sales_orders so
                                          inner join products p ON p.id=so.product_id
                                          inner join customers cs ON cs.id=so.customer_id
                                          ${query}
                                          `, [])

    }
    async fetchAllCustomersJson( query: string) {
        return await this._executeQuery(`SELECT cs.id as value,  cs.name AS label FROM biofuel.customers cs where cs.status = 1 ${query}`, [])
    }
    async fetchAllCustomersSOList( query : string ) {
        return await this._executeQuery(`SELECT  cs.id as value, cs.sales_order_no as label  FROM customer_sales_orders cs where cs.status = 1 ${query}`, [])
    }
    async fetchAllMappedSuppliersByCustomerId(limit: number, offset: number, sortOrder: string, query: string, condition: string) {
       console.log(`SELECT  supplier_id, sp.name as supplier,csm.status, ast.name as state, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                         inner join customers cs on cs.id=csm.customer_id
                                         inner join user sp on sp.id = csm.supplier_id
                                         inner join addresses a ON sp.id=a.user_id and a.address_type = 2
                                         inner join address_city ac ON ac.id=a.city_id 
                                         inner join address_state ast ON ac.state_id=ast.id
                                         where csm.status = 1  ${condition}  ${query}
                                         group by csm.supplier_id
                                         ${sortOrder}
                                         LIMIT ? OFFSET ? `, [limit, offset])
        return await this._executeQuery(`SELECT  csm.id, csm.supplier_id, sp.name as supplier,sp.mobile, sp.email, up.grade  ,ss.id as supplier_selection_id ,qt_factory_rate,qt_transportation_rate, qt_delivered_rate, qt_quantity, ss.status ,ac.id as city_id, ac.name as city,  ast.name as state, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                         left join customers cs on cs.id=csm.customer_id
                                         left join customer_sales_orders cso on cso.customer_id=csm.customer_id
                                         left join supplier_selection ss on ss.sales_order_id=cso.customer_id
                                         left join user sp on sp.id = csm.supplier_id
                                         left join users_profile up on up.user_id=sp.id
                                         left join addresses a ON sp.id=a.user_id and a.address_type = 2
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         where csm.status = 1  ${condition}  ${query}
                                         group by csm.supplier_id
                                         ${sortOrder}
                                         LIMIT ? OFFSET ? `, [limit, offset])
    }
    async fetchAllMappedSuppliersByCustomerIdCount(query: string, condition: string) {
        return await this._executeQuery(`SELECT  csm.id, csm.supplier_id, sp.name as supplier,sp.mobile, sp.email, up.grade , ss.id as supplier_selection_id ,qt_factory_rate,qt_transportation_rate, qt_delivered_rate, qt_quantity, ss.status ,ac.id as city_id, ac.name as city,  ast.name as state, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                         left join customers cs on cs.id=csm.customer_id
                                         left join customer_sales_orders cso on cso.customer_id=csm.customer_id
                                         left join supplier_selection ss on ss.sales_order_id=cso.customer_id
                                         left join user sp on sp.id = csm.supplier_id
                                         left join users_profile up on up.user_id=sp.id
                                         left join addresses a ON sp.id=a.user_id and a.address_type = 2
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         where csm.status = 1  ${condition}  ${query}
                                         group by csm.supplier_id
                                         `, [])
    }
   
}