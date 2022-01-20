import BaseModel from "../BaseModel";

export class RdModel extends BaseModel {
    constructor() {
        super();
    }

    async get_maturity_amount(data: any) {
        return await this._executeQuery("select maturity_amount from transaction_config where tenant_id = ? and transaction_type = ? and amount = ? and tenure = ?", [data.tenant_id, data.transaction_type, data.amount, data.tenure]);
    }

    async createRd(data: any) {
        return await this._executeQuery("insert into rd_transactions set ?", [data]);
    }

    async fetchRd(customer_id: any, tenant_id : number) {
        return await this._executeQuery("select * from rd_transactions where customer_id = ? and tenant_id = ?", [customer_id, tenant_id]);
    }
    async fetchAmountStartDate(id: number, tenant_id : number) {
        return await this._executeQuery("select id,amount,start_date,tenure from rd_transactions where id = ? and tenant_id = ?", [id,tenant_id]);
    }

    async fetchRdDetails(transaction_id: number) {
        return await this._executeQuery("select debit, date from customers_transaction_history where transaction_id = ?", [transaction_id]);
    }
}