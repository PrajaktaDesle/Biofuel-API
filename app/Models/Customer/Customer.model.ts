import BaseModel from "../BaseModel";

export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getCustomer(mobile:string, tenant_id : number){
        // return await this._excuteQuery("select id,tenant_id,email,password from customers where email = ? AND tenant_id = ? ", [data.email, data.tenant_id]);
        return await this._executeQuery("select * from customers where mobile = ? and tenant_id = ? ", [mobile, tenant_id]);
    }
    async createCustomer(customerData:any){
        return await this._executeQuery("insert into customers set ?", [customerData]);
    }
    async create_otp(data: any){
        return await this._executeQuery("insert into customer_login set ?", [data]);
    }
    async getCustomer_otp(data: any){
        return await this._executeQuery("select * from customer_login where req_id = ? ", [data.request_id]);
    }

    async findCustomers(customerData:any){
        const customerResult= await this._executeQuery("select * from customers where tenant_id = ? ",[customerData] )
        return customerResult;
    }
}