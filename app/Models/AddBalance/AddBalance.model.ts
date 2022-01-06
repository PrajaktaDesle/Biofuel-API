import BaseModel from "../BaseModel";

export class AddBalanceModel extends BaseModel {
    constructor() {
        super();
    }
    async createTransactionHistory(data: any) {
        return await this._executeQuery("insert into customers_transaction_history set ?", [data]);
    }

    async getCustomerBalance(customer_id: number) {
        return await this._executeQuery("select balance from customer_balance where customer_id = ?", [customer_id]);
    }
    async updateCustomerBalance(customer_id:number,balance:number) {
        return await this._executeQuery("update customer_balance set balance= ? where customer_id = ?", [balance,customer_id]);
    }
}