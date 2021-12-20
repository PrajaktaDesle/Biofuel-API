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

    async findCustomers(customerData:any){
        const customerResult= await this._executeQuery("select * from customers where tenant_id = ? ",[customerData] )
        return customerResult;
    }
}