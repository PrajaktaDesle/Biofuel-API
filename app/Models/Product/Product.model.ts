import { extractCookieFromRequest } from '../../utilities/ApiUtilities';
import BaseModel from '../BaseModel';

export class ProductModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async createProduct( productData : any ){
        return await this._executeQuery( "insert into products set ? ", [productData] )
    }
    async fetchProductById( id : any){
        return await this._executeQuery( "select p.id , p.name, p.description, p.hsn , p.igst as gst, category_id, pc.name as category,\n" +
            "usage_unit_id, pu.name as usage_unit,p.image, p.status \n" +
            "from products p\n" +
            "LEFT join product_categories pc ON  p.category_id = pc.id\n" +
            "LEFT join product_usage_unit pu ON p.usage_unit_id = pu.id  " +
            "where p.id = ? ", [id] )
    }

    async fetchAllProducts(limit : number, offset : number, sortOrder : string, query : string){
            return await this._executeQuery( `select p.id , p.name, p.description, p.hsn, p.igst as gst, category_id, pc.name as category,
                                              usage_unit_id, pu.name as usage_unit, p.status 
                                              from products p
                                              inner join product_categories pc ON  p.category_id = pc.id
                                              inner join product_usage_unit pu ON p.usage_unit_id = pu.id
                                              ${query}
                                              ${sortOrder} 
                                              LIMIT ? OFFSET ?`, [limit, offset]  )
    }

    async fetchAllProductCount(query : string){
        return await this._executeQuery( `select p.id , p.name, p.description, p.hsn, p.igst as gst, category_id, pc.name as category,
                                              usage_unit_id, pu.name as usage_unit, p.status 
                                              from products p
                                              inner join product_categories pc ON  p.category_id = pc.id
                                              inner join product_usage_unit pu ON p.usage_unit_id = pu.id
                                              ${query}  `, []  )
    }

    async updateProductById( data : any, id : number ){
        return await this._executeQuery( "update products set ? where id = ? ",[data,id] )
    }
    async fetchAllProductCategories( query:string ){
        console.log( `select id as value, name as label from product_categories  where ${query} ` )
        return await this._executeQuery( `select id as value, name as label from product_categories  ${query} `,[] )
    }
    async fetchAllProductUsageUnits( query:string ){
        return await this._executeQuery( `select id as value, name as label from product_usage_unit ${query}`,[] )
    }
    async fetchAllProductPackaging( query:string ){
        return await this._executeQuery( `select id as value, name as label from  product_packaging ${query}`,[])
    }
    async fetchAllProductRawMaterials( query:string ){
        return await this._executeQuery( `select id as value, name as label from  product_raw_material ${query}`,[])
    }
    async fetchAllProductsList( query:string ) {
        return await this._executeQuery(`SELECT  p.id as value , p.name as label FROM products p where p.status = 1 ${query}`, [])
    }

}