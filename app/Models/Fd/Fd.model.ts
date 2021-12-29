import BaseModel from "../BaseModel";

export class FdModel extends BaseModel {
    constructor() {
        super();
    }
  
    async createFd(data: any) {
        return await this._executeQuery("insert into fd_transactions set ?", [data]);
    }

    async fetchFd(tenant_id: number, customer_id: number) {
        return await this._executeQuery("select * from fd_transactions where tenant_id = ? and customer_id = ?", [tenant_id,customer_id]);
    }
}