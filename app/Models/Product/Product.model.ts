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
        return await this._executeQuery( "select p.id , p.name as productName, p.description, p.hsn as hsnCode, p.gst, category_id, pc.name as category,\n" +
            "usage_unit_id, pu.name as usage_unit, p.status as productStatus \n" +
            "from products p\n" +
            "inner join product_categories pc ON  p.category_id = pc.id\n" +
            "inner join product_usage_unit pu ON p.usage_unit_id = pu.id  " +
            "where p.id = ? ", [id] )
    }
    async fetchAllProducts(){
        return await this._executeQuery( "select * from products where status = 1", [] )
    }
    async updateProductById( data : any, id : number ){
        return await this._executeQuery( "update products set ? where id = ? ",[data,id] )
    }
    async fetchAllProductCategories(){
        return await this._executeQuery( "select id as value, name as label from product_categories ",[] )
    }
    async fetchAllProductUsageUnits(){
        return await this._executeQuery( "select id as value, name as label from product_usage_unit ",[] )
    }
    async fetchProductCategoryById(id:number){
        return await this._executeQuery( "select name from product_categories where id = ? ",[id])
    }
    async fetchProductUsageUnitById(id:number){
        return await this._executeQuery( "select name from product_usage_unit where id = ? ",   [id])

    }

}