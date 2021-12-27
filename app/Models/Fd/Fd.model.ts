import BaseModel from "../BaseModel";

export class FdModel extends BaseModel {
    constructor() {
        super();
    }

    async get_maturity_amount(data: any) {
        return await this._executeQuery("select maturing_amount from transaction_config where tenant_id = ? and transaction_type = ? and amount = ? and tenure = ?", [data.tenant_id, data.transaction_type, data.amount, data.tenure]);
    }

    async create_RD(data: any) {
        return await this._executeQuery("insert into rd_transaction set ?", [data]);
    }

    async get_customer(data: any) {
        return await this._executeQuery("select * from rd_transaction where customer_id = ? and tenant_id = ?", [data.customer_id, data.tenant_id]);
    }

    async update_customer(data: any, id: any) {
        return await this._executeQuery("update rd_transaction set ? WHERE id = ?", [data, id]);
    }

    async delete_customer(data: any) {
        return await this._executeQuery("update rd_transaction set status = 0 WHERE id = ?", [data.id]);
    }
}