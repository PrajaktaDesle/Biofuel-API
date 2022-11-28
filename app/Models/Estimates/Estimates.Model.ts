import { extractCookieFromRequest } from '../../utilities/ApiUtilities';
import BaseModel from '../BaseModel';

export class EstimateModel extends BaseModel
{
    constructor()
    {
        super();
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
        let query = await this._executeQuery( `SELECT es.id, customer_id, cs.name as customer,es.status, estimate_date, expiry_date, estimate_no , es.id ,product_id,p.name as product_name, product_description, raw_material_id, rm.name as raw_material, packaging_id, pp.name as packaging, adjustment_amount*rate as total_amount FROM biofuel.customer_estimates es
                                          inner join biofuel.products p ON p.id=es.product_id
                                          inner join biofuel.customers cs ON cs.id=es.customer_id
                                          inner join biofuel.product_raw_material rm ON rm.id=es.raw_material_id
                                          inner join biofuel.product_packaging pp ON pp.id=es.packaging_id;`, [] )
        console.log('query in model-------->', query)
        return query
    }
    async updateCustomerEstimateById( data : any, id : number ){
        return await this._executeQuery( "update customer_estimates set ? where id = ? ",[data,id] )
    }
    async estimateExistsOrNot( id : number ){
        return await this._executeQuery( "select id from customer_estimates where id = ? ",[id] )
    }
    

}