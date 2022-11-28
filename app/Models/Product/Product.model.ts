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
        return await this._executeQuery( "select * from products where id = ? ", [id] )
    }
    async fetchAllProducts(){
        return await this._executeQuery( "select * from products where status = 1", [] )
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
    async fetchProductCategoryById(id:number){
        return await this._executeQuery( "select id, name from product_categories where id = ? ",[id])
    }
    async fetchProductUsageUnitById(id:number){
        return await this._executeQuery( "select id, name from product_usage_unit where id = ? ",  [id])
    }
    async fetchAllProductPackaging(){
        return await this._executeQuery( "select id, name from  product_packaging",[])
    }
    async fetchRawMaterialByName(name:string){
        return await this._executeQuery( "select id from product_raw_material where name = ?", [name])
    }
    async fetchAllProductRawMaterials(){
        return await this._executeQuery( "select id, name from  product_raw_material",[])
    }
    async fetchProductPackagingByName(name:string){
        return await this._executeQuery( "select id from product_packaging where name = ?", [name])
    }
    // async getProductRawMaterials(){
    //     return await this._executeQuery("select * from product_raw_material ", []);
    // }

    // async getProductPackaging(){
    //     return await this._executeQuery("select * from product_packaging ", []);
    // }

}