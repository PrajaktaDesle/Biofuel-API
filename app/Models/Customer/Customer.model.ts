import BaseModel from "../BaseModel";

export class CustomerModel extends BaseModel
{
    constructor()
    {
        super();
    }
    async getCustomer(mobile:string, tenant_id : number){
        return await this._executeQuery("select * from customers where mobile = ? and tenant_id = ? ", [mobile, tenant_id]);
    }
    async createCustomer(customerData:any){
        const customerResult= await this._executeQuery("insert into customers set ?",[customerData] )
        return customerResult;
    }
    async create_otp(data: any){
        return await this._executeQuery("insert into customer_login set ?", [data]);
    }
    async getCustomer_otp(data: any){
        return await this._executeQuery("select * from customer_login where req_id = ? ", [data.request_id]);
    }
    async update_trials(req_id: any, trials: any){
        console.log(req_id, "-----------------", trials)
        return await this._executeQuery("update customer_login set trials = ? WHERE req_id = ?", [trials, req_id]);
    }
    async findCustomers(customerData:any){
        return await this._executeQuery("select * from customers where tenant_id = ?", [customerData]);
    }
}