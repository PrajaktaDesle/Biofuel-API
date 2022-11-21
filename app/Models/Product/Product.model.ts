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
    async fetchProductById( id : any ){
        return await this._executeQuery( "select * from products where id = ? ", [id] )
    }
    async fetchAllProducts(){
        return await this._executeQuery( "select * from products ", [] )
    }
    async updateProductById( data : any, id : number ){
        return await this._executeQuery( "update products set ? where id = ? ",[data,id] )
    }
    async fetchAllProductCategories(){
        return await this._executeQuery( "select id, name from product_categories ",[] )
    }
    async fetchAllProductUsageUnits(){
        return await this._executeQuery( "select id, name from product_usage_unit ",[] )
    }

}