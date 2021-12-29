import BaseModel from "../BaseModel";

export class FdModel extends BaseModel {
    constructor() {
        super();
    }
  
    async createFd(data: any) {
        return await this._executeQuery("insert into fd_transactions set ?", [data]);
    }

    async fetchROI(data: any) {
        return await this._executeQuery("select roi from transaction_config where tenant_id = ? and transaction_type = ? and amount = ? and tenure = ?", [data.tenant_id, data.transaction_type, data.amount, data.tenure]);
    }

    async fetchFd(tenant_id: number, customer_id: number) {
        return await this._executeQuery("select * from fd_transactions where tenant_id = ? and customer_id = ?", [tenant_id,customer_id]);
    }

    async get_customer(data: any) {
        return await this._executeQuery("select * from rd_transaction where customer_id = ? and tenant_id = ?", [data.customer_id, data.tenant_id]);
    }

}