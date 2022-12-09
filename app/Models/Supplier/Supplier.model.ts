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
   
    async fetchSupplierById(id: any ){
        return await this._executeQuery(`SELECT u.id, u.name , u.email,  u.mobile as contact_no, a.latitude, a.longitude, p.grade , up.aadhaar_no, up.aadhaar_url, up.pan_no, up.pan_url, up.gstin_no, up.gstin_url, up.msme_no, up.msme_url,  u.status, up.comment,
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
                                         p.payment_term, rm.raw_material_id, (select name from biofuel.product_raw_material pr where rm.raw_material_id=pr.id) as raw_material, packaging_id, (select name from biofuel.product_packaging pp where pm.packaging_id=pp.id) as packaging, u.created_at, u.updated_at 
                                         FROM biofuel.user u 
                                         inner join biofuel.addresses a ON a.user_id=u.id  
                                         inner join biofuel.users_profile p ON a.user_id=p.user_id
                                         inner join biofuel.address_city cty ON a.city_id = cty.id
                                         inner join biofuel.users_profile up ON u.id = up.user_id
                                         inner join biofuel.address_state st ON cty.state_id = st.id
                                         inner join biofuel.supplier_raw_material_mapping rm ON rm.supplier_id = u.id
                                         inner join biofuel.supplier_packaging_mapping pm ON pm.supplier_id = u.id
                                         where u.id = ?
                                         group by u.id`, [id]);
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
                                         FROM biofuel.user u 
                                         inner join biofuel.addresses a ON a.user_id=u.id  
                                         inner join biofuel.users_profile p ON a.user_id=p.user_id
                                         inner join biofuel.address_city cty ON a.city_id = cty.id
                                         inner join biofuel.address_state st ON cty.state_id = st.id
                                         where u.role_id = 3 ${query}
                                         group by u.id
                                         ${sortOrder} 
                                         LIMIT ? OFFSET ?`, [limit, offset]  )
    }
    async fetchAllSuppliersCount(query : string){
        return await this._executeQuery( `SELECT u.id FROM biofuel.user u 
                                          inner join biofuel.addresses a ON a.user_id=u.id  
                                          inner join biofuel.address_city cty ON a.city_id = cty.id
                                          inner join biofuel.address_state st ON cty.state_id = st.id
                                          where u.role_id = 3
                                          group by u.id;
                                          ${query}  `, []  )
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
     
    async supplierPackagingMapping( data : any){
        return await this._executeQuery( "insert into supplier_packaging_mapping set ?", [data])
    }

    async getHomePage(){
        return await this._executeQuery( "select id , name, image_url from app_homepage ",[])
    }

}