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
        return await this._executeQuery("insert into customers set ?", [customerData]);
    }
    async create_otp(data: any){
        return await this._executeQuery("insert into customer_login set ?", [data]);
    }
    async getCustomer_otp(data: any){
        return await this._executeQuery("select * from customer_login where req_id = ? ", [data.request_id]);
    }
    async update_trials(req_id: any, trials: any){
        return await this._executeQuery("update customer_login set trials = ? WHERE req_id = ?", [trials, req_id]);
    }
    async findAllCustomers(customerData:any){
        return await this._executeQuery("select * from customers where tenant_id = ?", [customerData]);
    }
    async findCustomerById(id: any, tenant_id: any ){
        return await this._executeQuery("select * from customers where id = ? and tenant_id = ? ", [id, tenant_id]);
    }
    async updateCustomerById(data:any){
        return await this._executeQuery("update customers set mobile = ? where id = ? and tenant_id = ? ", [data.mobile,data.id, data.tenant_id]);
    }
    async updateCustomerStatus(data:any){
        return await this._executeQuery("update customers set status = ? where id = ? and tenant_id = ? ", [data.status,data.id, data.tenant_id]);
    }
    async getCustomerStatus(mobile:string, tenant_id : number){
        return await this._executeQuery("select status from customers where mobile = ? and tenant_id = ? ", [mobile, tenant_id]);
    }

    async getCustomerRD(customer_id: number, tenant_id: number ){
        return await this._executeQuery("select amount from rd_transactions where customer_id = ? and tenant_id = ? ", [customer_id, tenant_id]);
    }
    async getCustomerFD(customer_id: number, tenant_id: number ){
        return await this._executeQuery("select amount from fd_transactions where customer_id = ? and tenant_id = ? ", [customer_id, tenant_id]);
    }
}