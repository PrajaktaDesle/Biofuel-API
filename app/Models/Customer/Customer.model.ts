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
        return await this._executeQuery("update customers set ? where id = ? ", [
            customerData,
            id,
        ]);
    }

    async fetchCustomerById(id: any) {
        return await this._executeQuery(
            `SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.gstin_url as gstin_img, cs.payment_term as paymentTerms, cs.status,
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
                                         group by cs.id`,
            [id]
        );
    }
    async fetchAllCustomers(
        limit: number,
        offset: number,
        sortOrder: string,
        query: string
    ) {
        return await this._executeQuery(
            `SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo, cs.gstin as gstNo, cs.payment_term as paymentTerms, cs.status,
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
                                        LIMIT ? OFFSET ? `,
            [limit, offset]
        );
    }
    async fetchAllCustomerCount(query: string) {
        return await this._executeQuery(
            `SELECT cs.id, cs.name as customerName, cs.email, cs.mobile as contactNo ,cs.payment_term,cs.status,cs.gstin, cs.gstin_url,a.address as shipping_address,a.address as billing_address,a.latitude, a.longitude, a.user_type,ac.id as city_id , ac.name as city, ac.state_id, ast.name as state, a.pincode, cs.created_at, cs.updated_at 
                                         FROM customers cs 
                                         left join addresses a ON a.user_id=cs.id 
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         ${query} 
                                         group by cs.id`,
            []
        );
    }
    // customer-supplier mapping
    async addCustomerSupplierMapping(data: any) {
        return await this._executeQuery(
            "insert into customer_supplier_mapping ( customer_id, state_id, supplier_id ) values ? ",
            [data]
        );
    }
    async addOrUpdateCustomerSupplierMapping(data: any) {
        return await this._executeQuery(
            `INSERT INTO customer_supplier_mapping set ? ON DUPLICATE KEY UPDATE    
            status=1 `,
            [data]
        );
    }
    async createCustomerSupplierMapping(
        customer_id: number,
        supplier_id: number
    ) {
        return await this._executeQuery(
            `INSERT INTO customer_supplier_mapping(customer_id,address_id,supplier_id)
                                         select a.user_id as customer_id, a.id as address_id,sp.id as supplier_id
                                         from user as sp, addresses as a
                                         where (a.user_id = ? and address_type = 0 and user_type = 0) and (sp.id = ? and role_id = 3);
                                        `,
            [customer_id, supplier_id]
        );
    }

    async updateStatusById(status: number, id: number) {
        return await this._executeQuery(
            "update customer_supplier_mapping set status = ? where id = ?  ",
            [status, id]
        );
    }
    async updateCustomerSupplierMapping(data : any, customer_id: number, state_id: number) {
        return await this._executeQuery(
            "update customer_supplier_mapping set ? where customer_id = ? and state_id = ? ",
            [data, customer_id, state_id]
        );
    }
    async fetchCSM(customer_id: number, supplier_id: number) {
        return await this._executeQuery(
            "select * from customer_supplier_mapping where customer_id = ? and supplier_id =  ?",
            [customer_id, supplier_id]
        );
    }
    async fetchAllCustomerSuppliers(
        limit: number,
        offset: number,
        sortOrder: string,
        query: string) {
        // return await this._executeQuery(`SELECT csm.id, customer_id, cs.name as customer,FLOOR((count(csm.supplier_id)/2)) as supplier, case when a.address_type=0 then ast.name ELSE null end as state FROM customer_supplier_mapping csm
        return await this._executeQuery(
            `SELECT csm.id, customer_id, cs.name as customer,count(csm.supplier_id) as supplier, ast.name as state FROM customer_supplier_mapping csm
                                         left join customers cs on cs.id=csm.customer_id
                                         left join addresses a ON csm.customer_id=a.user_id and a.address_type = 0
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         where csm.status  = 1 ${query}
                                         group by csm.customer_id
                                         ${sortOrder}
                                         LIMIT ? OFFSET ? `,
            [limit, offset]
        );
    }
    async fetchAllMappedSuppliers(customer_id: number) {
        return await this._executeQuery(
            `SELECT  csm.id as mapping_id, supplier_id as id , sp.name as supplier,csm.status, ast.name as state, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
                                         left join customers cs on cs.id=csm.customer_id
                                         left join user sp on sp.id = csm.supplier_id
                                         left join addresses a ON sp.id=a.user_id and a.address_type = 2
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         where csm.customer_id = ? and csm.status = 1 
                                         group by csm.supplier_id`,
            [customer_id]
        );
    }
    async fetch_csm_count(query: string) {
        // return await this._executeQuery(
        //     `SELECT customer_id, cs.name as customer, supplier_id, sp.name as supplier,csm.status, csm.created_at , csm.updated_at FROM customer_supplier_mapping csm
        //                                         left join customers cs on cs.id=csm.customer_id
        //                                         left join user sp on sp.id = csm.supplier_id
        //                                         ${query}`,
        //     []
        // );
        return this._executeQuery(`SELECT csm.id, customer_id, cs.name as customer,count(csm.supplier_id) as supplier, ast.name as state FROM customer_supplier_mapping csm
                                         left join customers cs on cs.id=csm.customer_id
                                         left join addresses a ON csm.customer_id=a.user_id and a.address_type = 0
                                         left join address_city ac ON ac.id=a.city_id 
                                         left join address_state ast ON ac.state_id=ast.id
                                         where csm.status  = 1 ${query}
                                         group by csm.customer_id`,
            [])
    }
    async createCustomerEstimate(estimateData: any) {
        return await this._executeQuery("insert into customer_estimates set ? ", [
            estimateData,
        ]);
    }
    async fetchCustomerEstimateById(id: any) {
        return await this._executeQuery(
            `SELECT es.id, customer_id, cs.name as customer,es.status,  DATE_FORMAT(estimate_date, '%Y-%m-%d') as estimate_date, DATE_FORMAT(expiry_date, '%Y-%m-%d') as expiry_date, estimate_no, es.raw_material_id, prm.name as raw_material ,product_id,p.name as product, es.product_description, packaging_id, pp.name as packaging, quantity, rate, es.adjustment_amount as adjustment,tnc, customer_note, IFNULL(adjustment_amount, 0)+(rate*quantity) as total_amount
                                          FROM customer_estimates es
                                          left join products p ON p.id=es.product_id
                                          left join customers cs ON cs.id=es.customer_id
                                          left join product_raw_material prm ON prm.id=es.raw_material_id
                                          left join product_packaging pp ON pp.id=es.packaging_id
                                          where es.id = ? `,
            [id]
        );
    }
    async fetchAllCustomerEstimates(
        limit: number,
        offset: number,
        sortOrder: string,
        query: string
    ) {
        return await this._executeQuery(
            `SELECT es.id, customer_id, cs.name as customer,cs.email,es.status, DATE_FORMAT(estimate_date, '%d-%m-%Y')  as estimate_date ,DATE_FORMAT(expiry_date, '%d-%m-%Y')  as expiry_date , estimate_no , es.id ,product_id,p.name as product_name, es.product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, IFNULL(adjustment_amount, 0)+(rate*quantity) as total_amount FROM customer_estimates es
                                          left join products p ON p.id=es.product_id
                                          left join customers cs ON cs.id=es.customer_id
                                          left join product_raw_material rm ON rm.id=es.raw_material_id
                                          left join product_packaging pp ON pp.id=es.packaging_id
                                          ${query}
                                          ${sortOrder} 
                                          LIMIT ? OFFSET ?`,
            [limit, offset]
        );
    }
    async updateCustomerEstimateById(data: any, id: number) {
        return await this._executeQuery(
            "update customer_estimates set ? where id = ? ",
            [data, id]
        );
    }
    async estimateExistsOrNot(id: number) {
        return await this._executeQuery(
            "select id from customer_estimates where id = ? ",
            [id]
        );
    }
    async createCustomerEstimateStagelog(data: any) {
        return await this._executeQuery(
            "insert into customer_estimate_stage_logs set ? ",
            [data]
        );
    }
    async createCustomerSalesOrder(data: any) {
        return await this._executeQuery(
            "insert into customer_sales_orders set ? ",
            [data]
        );
    }
    async updateCustomerSalesOrder(data: any, id: number) {
        return await this._executeQuery(
            "update customer_sales_orders set ? where id = ? ",
            [data, id]
        );
    }
    async fetchCustomerSalesOrderById(id: number) {
        return await this._executeQuery(
            `SELECT so.id, customer_id, cs.name as customer,so.status,sales_order_no, so.payment_term, a.address, a.address_type,ac.name as city, ast.name as state ,  a.pincode, DATE_FORMAT(so_date, '%Y-%m-%d') as so_date,  DATE_FORMAT(delivery_date, '%Y-%m-%d') as delivery_date, estimate_id ,product_id,p.name as product, so.product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, rate, quantity, adjustment_amount, tnc, customer_note,  IFNULL(adjustment_amount, 0)+(rate*quantity) as total_amount FROM customer_sales_orders so
                                          left join products p ON p.id=so.product_id
                                          left join customers cs ON cs.id=so.customer_id
                                          left join addresses a on a.user_id = cs.id and a.address_type = 1
                                          left join address_city ac on ac.id = a.city_id
                                          left join address_state ast on ast.id = ac.id
                                          left join product_raw_material rm ON rm.id=so.raw_material_id
                                          left join product_packaging pp ON pp.id=so.packaging_id
                                          where so.id = ?`,
            [id]
        );
    }
    async fetchAllCustomerSalesOrders(
        limit: number,
        offset: number,
        sortOrder: string,
        query: string
    ) {
        return await this._executeQuery(
            `SELECT so.id, customer_id, cs.name as customer,so.status, DATE_FORMAT(so_date, '%d-%m-%Y')  as so_date, DATE_FORMAT(delivery_date, '%d-%m-%Y') as delivery_date, estimate_id ,product_id,p.name as product, so.product_description, IFNULL(adjustment_amount, 0)+(rate*quantity) as total_amount, sales_order_no FROM customer_sales_orders so
                                          left join products p ON p.id=so.product_id
                                          left join customers cs ON cs.id=so.customer_id
                                          ${query}
                                          ${sortOrder} 
                                          LIMIT ? OFFSET ? `,
            [limit, offset]
        );
    }
    async salesOrderExistsOrNot(id: number) {
        return await this._executeQuery(
            "select id from customer_sales_orders where id = ? ",
            [id]
        );
    }
    async estimateNoExistsOrNot(no: number) {
        return await this._executeQuery(
            "select id from customer_estimates where estimate_no = ? ",
            [no]
        );
    }
    async estimateIdNoExistsOrNot(id: number, no: number) {
        return await this._executeQuery(
            "select id from customer_estimates where id=? and estimate_no = ? ",
            [id, no]
        );
    }
    async salesOrderNoExistsOrNot(no: number) {
        return await this._executeQuery(
            "select id from customer_sales_orders where sales_order_no = ? ",
            [no]
        );
    }
    async salesOrdeIdrNoExistsOrNot(id: number, no: number) {
        return await this._executeQuery(
            "select id from customer_sales_orders where id=? and sales_order_no = ? ",
            [id, no]
        );
    }
    // async fetchAllCustomerEstimatesCount(query: string) {
    async fetchALLActiveCustomers() {
        return await this._executeQuery(
            `select cs.id as value , concat(cs.name ,', ', ac.name) as label
                                               from customers cs
                                               left join addresses a on a.user_id = cs.id 
                                               left join address_city ac on a.city_id = ac.id
                                               where a.user_type = 0 and a.address_type = 0 and a.status = 1;`, []);
    }
    async fetchAllmappedSuppliersByAddressId(address_id: number) {
        return await this._executeQuery(
            `select csm.supplier_id ,sp.name as supplier,email,ac.name as city, ast.name as state,
             csm.status, csm.created_at, csm.updated_at
             from customer_supplier_mapping csm
             left join addresses a on csm.supplier_id = a.user_id 
             left join user sp on a.user_id = sp.id
             left join address_city ac on a.city_id = ac.id and a.address_type = 1
             left join address_state ast on ac.state_id = ast.id
             where csm.address_id = ? and csm.status = 1
             group by supplier_id
             `,
            [address_id]
        );
    }
    
    
    async fetchAllCustomerEstimatesCount(query: string) {
        return await this._executeQuery(
            `SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no , es.id ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, IFNULL(adjustment_amount, 0)+(rate*quantity) as total_amount FROM customer_estimates es
                                        left join products p ON p.id=es.product_id
                                        left join customers cs ON cs.id=es.customer_id
                                        left join product_raw_material rm ON rm.id=es.raw_material_id
                                        left join product_packaging pp ON pp.id=es.packaging_id
                                        ${query}
                                        `,
            []
        );
    }
    async fetchAllCustomerSalesOrdersCount(query: string) {
        return await this._executeQuery(
            `SELECT so.id, customer_id, cs.name as customer,so.status, so_date, delivery_date, estimate_id ,product_id,p.name as product, product_description, adjustment_amount*rate as total_amount FROM customer_sales_orders so
                                          left join products p ON p.id=so.product_id
                                          left join customers cs ON cs.id=so.customer_id
                                          ${query}
                                          `,
            []
        );
    }
    async fetchAllCustomersList(query: string) {
        return await this._executeQuery(
            `SELECT cs.id as value,  cs.name AS label FROM biofuel.customers cs where cs.status = 1 ${query}`,
            []
        );
    }
    async fetchAllCustomersSOList(query: string) {
        return await this._executeQuery(
            `SELECT  cs.customer_id as value, cs.sales_order_no as label FROM customer_sales_orders cs where cs.status = 1 ${query}`,
            []
        );
    }
    async fetchAllCSOList(query: string) {
        return await this._executeQuery(
            `SELECT  cs.id as value, cs.sales_order_no as label, cs.customer_id FROM customer_sales_orders cs where cs.status = 1 ${query}`,
            []
        );
    }
    async fetchAllMappedSuppliersByCustomerId(
        limit: number,
        offset: number,
        sortOrder: string,
        query: string,
        customer_id: number,
        sales_order_id: number,
        condition: string
    ) {
        return await this._executeQuery(
            `SELECT  csm.id,ss.sales_order_id, cs.id as customer_id, cs.name as customer, cso.sales_order_no, csm.supplier_id, sp.name as supplier,sp.mobile, sp.email, up.grade, ss.id as supplier_selection_id, 
            factoryRate.factory_rate as latest_factory_rate,
            deliveredRate.delivered_rate as latest_delivered_rate,
            qt_factory_rate,qt_transportation_rate, qt_delivered_rate, qt_quantity, ss.status ,ac.id as city_id, ac.name as city,  ast.name as state, csm.created_at , csm.updated_at
            FROM customer_supplier_mapping csm
            INNER join customers cs on cs.id=csm.customer_id
            left join customer_sales_orders cso on cso.id = ${sales_order_id}  and cso.customer_id=csm.customer_id
            left join user sp on sp.id = csm.supplier_id
            LEFT join supplier_selection ss on  ss.supplier_id = sp.id and ss.sales_order_id = ${sales_order_id} 
            LEFT JOIN(select supplier_id, rate as factory_rate from supplier_purchase_order where id in
            (SELECT max(id) FROM supplier_purchase_order  
            where rate_type = "0" group by supplier_id))factoryRate on sp.id = factoryRate.supplier_id
            LEFT JOIN(select supplier_id, rate as delivered_rate from supplier_purchase_order where id in
            (SELECT max(id) FROM supplier_purchase_order  
            where rate_type = "1" group by supplier_id))deliveredRate on sp.id = deliveredRate.supplier_id
            left join users_profile up on up.user_id=sp.id
            left join addresses a ON sp.id=a.user_id and a.address_type = 2
            left join address_city ac ON ac.id=a.city_id 
            left join address_state ast ON ac.state_id=ast.id
            where csm.status = 1 and csm.customer_id = ${customer_id}                                      
             ${condition}  ${query}
             ${sortOrder}
             LIMIT ? OFFSET ? `,
            [limit, offset]
        );
    }
    async fetchAllMappedSuppliersByCustomerIdCount(
        query: string,
        customer_id: number,
        sales_order_id: number,
        condition: string
    ) {
        return await this._executeQuery(
            `SELECT  sp.id as id ,ss.sales_order_id, cs.id as customer_id, cs.name as customer, cso.sales_order_no, csm.supplier_id, sp.name as supplier,sp.mobile, sp.email, up.grade, ss.id as supplier_selection_id, 
            factoryRate.factory_rate as latest_factory_rate,
            deliveredRate.delivered_rate as latest_delivered_rate,
            qt_factory_rate,qt_transportation_rate, qt_delivered_rate, qt_quantity, ss.status ,ac.id as city_id, ac.name as city,  ast.name as state, csm.created_at , csm.updated_at
            FROM customer_supplier_mapping csm
            INNER join customers cs on cs.id=csm.customer_id
            left join customer_sales_orders cso on cso.id = ${sales_order_id}  and cso.customer_id=csm.customer_id
            left join user sp on sp.id = csm.supplier_id
            LEFT join supplier_selection ss on  ss.supplier_id = sp.id and ss.sales_order_id = ${sales_order_id} 
            LEFT JOIN(select supplier_id, rate as factory_rate from supplier_purchase_order where id in
            (SELECT max(id) FROM supplier_purchase_order  
            where rate_type = "0" group by supplier_id))factoryRate on sp.id = factoryRate.supplier_id
            LEFT JOIN(select supplier_id, rate as delivered_rate from supplier_purchase_order where id in
            (SELECT max(id) FROM supplier_purchase_order  
            where rate_type = "1" group by supplier_id))deliveredRate on sp.id = deliveredRate.supplier_id
            left join users_profile up on up.user_id=sp.id
            left join addresses a ON sp.id=a.user_id and a.address_type = 2
            left join address_city ac ON ac.id=a.city_id 
            left join address_state ast ON ac.state_id=ast.id
            where csm.status = 1 and csm.customer_id = ${customer_id}   
             ${condition}  ${query}
             group by csm.supplier_id
             `,
            []
        );
    }
}
