import UserModel from "../User/User.model";
import {Connection} from "mysql2";
import { createECDH } from "crypto";

export class SupplierModel extends UserModel
{
    constructor()
    {
        super();
    }
   
    async createSuppliersProfile(supplierData:any){
        return await this._executeQuery("insert into users_profile set ?", [supplierData]);
    }

    async createSuppliersAddress(supplierData:any){
        return await this._executeQuery("insert into addresses set ?", [supplierData]);
    }
   // JSON_ARRAYAGG(JSON_OBJECT('value', rm.raw_material_id, 'label', pr.name)) as raw_material,
    async fetchSupplierById(id: any ){
        return await this._executeQuery(`SELECT u.id, u.name , u.email,  u.mobile as contact_no,  p.grade , up.aadhaar_no, up.aadhaar_url as aadhaar_img, up.pan_no, up.pan_url as pan_img, up.gstin_no, up.gstin_url as gstin_img, up.msme_no, up.msme_url as msme_img,  u.status, up.comment,
                                         p.payment_term, 
                                         max(case when a.address_type = "2" then a.address ELSE null end) as source_address,
                                         max(case when a.address_type = "2" then st.id end) as source_state_id,
                                         max(case when a.address_type = "2" then st.name end) as source_state,
                                         max(case when a.address_type = "2" then cty.id end) as source_city_id,
                                         max(case when a.address_type = "2" then cty.name end) as source_city,
                                         max(case when a.address_type = "2" then a.pincode end) as source_pincode,
                                         max(case when a.address_type = "1" then a.address ELSE null end) as billing_address,
                                         max(case when a.address_type = "1" then st.id end) as billing_state_id,
                                         max(case when a.address_type = "1" then st.name end) as billing_state,
                                         max(case when a.address_type = "1" then cty.id end) as billing_city_id,
                                         max(case when a.address_type = "1" then cty.name end) as billing_city,
                                         max(case when a.address_type = "1" then a.pincode end) as billing_pincode,
                                         
                                         CAST(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('value', rm.raw_material_id, 'label', pr.name)), ']') AS JSON) as raw_material, 
                                         packaging_id, pp.name as packaging, u.created_at, u.updated_at 
                                         FROM user u 
                                         left join addresses a ON a.user_id=u.id  
                                         left join address_city cty ON a.city_id = cty.id
                                         left join address_state st ON cty.state_id = st.id
                                         
                                         left join users_profile p ON u.id=p.user_id
                                         
                                         left join users_profile up ON u.id = up.user_id
                                         
                                         LEFT join supplier_raw_material_mapping rm ON rm.supplier_id = u.id
                                         LEFT join supplier_packaging_mapping pm ON pm.supplier_id = u.id
                                         left join product_raw_material pr on rm.raw_material_id=pr.id
                                         left join product_packaging pp on pm.packaging_id=pp.id
                                         where u.id = ?  and rm.status=1
                                         group by u.id;`, [id]);
    }  

    async fetchAllSuppliers(limit : number, offset : number, sortOrder : string, query : string){
        return await this._executeQuery(`SELECT u.id, u.name , u.email,  u.mobile as contact_no, a.latitude, a.longitude, case when p.grade = 1 then 'A' when p.grade = 2 then 'B' when p.grade = 3 then 'C' when p.grade = 4 then 'D' else null end as grade,  u.status,
                                         max(case when a.address_type = "2" then a.address ELSE null end) as source_address,
                                         max(case when a.address_type = "2" then st.id end) as source_state_id,
                                         max(case when a.address_type = "2" then st.name end) as source_state,
                                         max(case when a.address_type = "2" then cty.id end) as source_city_id,
                                         max(case when a.address_type = "2" then cty.name end) as source_city,
                                         max(case when a.address_type = "2" then a.pincode end) as source_pincode,
                                         max(case when a.address_type = "1" then a.address ELSE null end) as billing_address,
                                         max(case when a.address_type = "1" then st.id end) as billing_state_id,
                                         max(case when a.address_type = "1" then st.name end) as billing_state,
                                         max(case when a.address_type = "1" then cty.id end) as billing_city_id,
                                         max(case when a.address_type = "1" then cty.name end) as billing_city,
                                         max(case when a.address_type = "1" then a.pincode end) as billing_pincode,
                                         u.created_at, u.updated_at 
                                         FROM user u 
                                         inner join addresses a ON a.user_id=u.id  
                                         inner join users_profile p ON a.user_id=p.user_id
                                         inner join address_city cty ON a.city_id = cty.id
                                         inner join address_state st ON cty.state_id = st.id
                                         where u.role_id = 3 ${query}
                                         group by u.id
                                         ${sortOrder} 
                                         LIMIT ? OFFSET ?`, [limit, offset]  )
    }
    async fetchAllSuppliersCount(query : string){
        return await this._executeQuery( `SELECT u.id, u.name , u.email,  u.mobile as contact_no, a.latitude, a.longitude, case when p.grade = 1 then 'A' when p.grade = 2 then 'B' when p.grade = 3 then 'C' when p.grade = 4 then 'D' else null end as grade,  u.status,
                                          u.created_at, u.updated_at 
                                          FROM user u 
                                          inner join addresses a ON a.user_id=u.id  
                                          inner join users_profile p ON a.user_id=p.user_id
                                          inner join address_city cty ON a.city_id = cty.id
                                          inner join address_state st ON cty.state_id = st.id
                                          where u.role_id = 3 ${query}
                                          group by u.id
                                           `, []  )
    }


    async updateSuppliersProfileDetails(updatedSupplierData:any,id:number){
        return await this._executeQuery("update users_profile set ? where user_id = ? ", [updatedSupplierData,id]);
    }
    async updateSuppliersAddressDetails(updatedSupplierData:any,id:number,a_type:number){
        return await this._executeQuery("update addresses set ? where user_id = ? and address_type = ?", [updatedSupplierData,id,a_type]);
    }
    async updateSuppliersPackagingMapping(updatedData:any,id:number){
        return await this._executeQuery("update supplier_packaging_mapping set ? where supplier_id = ?", [updatedData,id]);
    }
    async updateSuppliersRawMaterialMapping(updatedData:any,id:number){
        return await this._executeQuery("update supplier_raw_material_mapping set ? where supplier_id = ? ", [updatedData,id]);
    }
    async createOtp( data : any ){
        return await this._executeQuery( "insert into users_login_logs set ?", [data]);
    }

    async getSupplierOtp( data : any ){
        return await this._executeQuery( "select * from users_login_logs where req_id = ?", [data.request_id])
    }

    async updateTrials( req_id : any, trials : any){
        return await this._executeQuery( "update users_login_logs set trials = ? where req_id = ?", [trials, req_id])
    }

    async supplierRawMaterialMapping( data : any){
        return await this._executeQuery( "insert into supplier_raw_material_mapping set ?", [data])
    }
    async supplierRawMaterialMappingMany( data : any){
        return await this._executeQuery( "insert into supplier_raw_material_mapping (supplier_id, raw_material_id, status) VALUES ?", [data])
    }
    async supplierPackagingMapping( data : any){
        return await this._executeQuery( "insert into supplier_packaging_mapping set ?", [data])
    }

    async getHomePage(){
        return await this._executeQuery( "select id , name, image_url from app_homepage ",[])
    }
    async getSuppliersByState(state_id:number){
        return await this._executeQuery(`select sp.id, sp.name as supplier,sp.status,
                                                  ac.name as city,st.name as state
                                                  from user sp
                                                  inner join addresses a on sp.id = a.user_id 
                                                  inner join address_city ac on  a.city_id = ac.id 
                                                  inner join address_state st on ac.state_id = st.id 
                                                  where a.address_type = 1 and sp.status = 1 and st.id = ?
                                                  `, [state_id])
    }
    async fetchAllSupplierPO(limit : number, offset : number, sortOrder : string, query : string){
        return await this._executeQuery(`SELECT spo.id, s.name as supplier, c.name as customer, p.name as product, spo.sales_order_id, spo.quantity,DATE_FORMAT(spo.delivery_date, '%d-%m-%Y')  as delivery_date, spo.status FROM supplier_purchase_order spo
                                         left join customer_sales_orders cso on cso.id = spo.sales_order_id
                                         left join customers c on c.id = cso.customer_id
                                         left join products p on p.id = cso.product_id
                                         left join user s on s.id = spo.supplier_id
                                         ${query}
                                         ${sortOrder} 
                                         LIMIT ? OFFSET ?`, [limit, offset]  )
    }
    async fetchAllSupplierPOCount(query : string){
        return await this._executeQuery(`SELECT spo.id, s.name as supplier, c.name as customer, p.name as product, spo.sales_order_id, spo.quantity,DATE_FORMAT(spo.delivery_date, '%d-%m-%Y')  as delivery_date, spo.status FROM supplier_purchase_order spo
                                         left join customer_sales_orders cso on cso.id = spo.sales_order_id
                                         left join customers c on c.id = cso.customer_id
                                         left join biofuel.products p on p.id = cso.product_id
                                         left join user s on s.id = spo.supplier_id
                                         ${query}
                                         `, []  )
    }
    async updateSupplierPO( data : any, id : number ){
        return await this._executeQuery( `update supplier_purchase_order set ? where id = ?  `, [data, id])
    }
    async SupplierPOExistsOrNot( id : number ){
        return await this._executeQuery( `select id from supplier_purchase_order where id = ?`, [id])
    }
    async createSupplierPOLogs( data : any ){
        return await this._executeQuery( ` insert into supplier_purchase_order_stage_logs set ? `, [data])
    }
    async fetchAllSuppliersList() {
        return await this._executeQuery(`SELECT  CAST(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('value', u.id, 'label', u.name)), ']') AS JSON) as suppliers
        FROM user u where u.status = 1 and u.role_id = 3`, [])
    }
    async createSuppliersPO(supplierData:any){
        return await this._executeQuery("insert into supplier_purchase_order set ?", [supplierData]);
    }
    
}