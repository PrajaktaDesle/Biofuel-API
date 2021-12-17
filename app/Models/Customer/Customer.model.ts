import BaseModel from "../BaseModel";

export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async createCustomer(customerData:any){
        const customerResult= await this._executeQuery("insert into customers set ?",[customerData] )
        return customerResult;
    }
}