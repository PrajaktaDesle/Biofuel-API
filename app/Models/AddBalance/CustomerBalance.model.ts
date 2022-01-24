import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class CustomerBalanceModel extends BaseModel {
    constructor() {
        super();
    }
    async createTransactionHistory(sqlConnection : Connection, data: any) {
        return await this._executeQueryTransaction(sqlConnection, "insert into customers_transaction_history set ?", [data]);
    }

    async getCustomerBalance(customer_id: number) {
        return await this._executeQuery("select balance from customer_balance where customer_id = ? ", [customer_id]);
    }

    async getCustomerBalanceLock(sqlConnection : Connection, customer_id: number) {
        return await this._executeQueryTransaction(sqlConnection, "select balance from customer_balance where customer_id = ? for update", [customer_id]);
    }

    async updateCustomerBalance(sqlConnection : Connection, customer_id:number, new_balance:number) {
        return await this._executeQueryTransaction(sqlConnection, "update customer_balance set balance =  ? where customer_id = ?", [new_balance, customer_id]);
    }
}