import BaseModel from "../BaseModel";

export class RdModel extends BaseModel {
    constructor() {
        super();
    }

    async get_maturity_amount(data: any) {
        return await this._executeQuery("select maturing_amount from transaction_config where tenant_id = ? and transaction_type = ? and amount = ? and tenure = ?", [data.tenant_id, data.transaction_type, data.amount, data.tenure]);
    }

    async create_RD(data: any) {
        return await this._executeQuery("insert into rd_transaction set ?", [data]);
    }

    async fetch_RD(customer_id: any, tenant_id : number) {
        return await this._executeQuery("select * from rd_transaction where customer_id = ? and tenant_id = ?", [customer_id, tenant_id]);
    }
}