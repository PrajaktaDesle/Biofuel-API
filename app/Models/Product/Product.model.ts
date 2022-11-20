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
    async updateProductById( data : any, id : number ){
        return await this._executeQuery( "update products set ? where id = ? ",[data,id] )
    }

}