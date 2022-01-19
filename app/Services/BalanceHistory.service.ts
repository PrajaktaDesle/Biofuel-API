import LOGGER from "../config/LOGGER";
import {CustomerBalanceModel} from "../Models/AddBalance/CustomerBalance.model";
import {PoolConnection} from "mysql2";

async function createTransHistory(data: any) {
    let sqlConnection : PoolConnection;
    let customerBalModel = new CustomerBalanceModel();
    //Get Connection
    // @ts-ignore
    sqlConnection = await customerBalModel._getConnection();
    try {
        //Begin Transaction
        await sqlConnection.beginTransaction;
        let customer_balance = await customerBalModel.getCustomerBalanceLock(sqlConnection, data.customer_id);
        if (data.amount < 0 && data.amount !== null && (customer_balance[0].balance + data.amount) < 0 ) throw new Error("Insufficient Balance");
        data.pre_balance =  customer_balance[0].balance + data.amount;
        if (data.amount > 0 && data.amount !== null){
            data.credit = data.amount;
        }else{
            data.debit = data.amount;
        }
        delete data.amount;
        let TransHistDetail = await customerBalModel.createTransactionHistory(sqlConnection, data);
        data.customer_balance= data.new_balance;
        const customerBalanceInfo = await customerBalModel.updateCustomerBalance(sqlConnection, data.customer_id, data.customer_balance);
        // Commit Transaction
        await sqlConnection.commit();
        await sqlConnection.release();
        return TransHistDetail;
    }catch (Error) {
        // Rollback Transaction
        if(sqlConnection !== null ) await sqlConnection.rollback;
        await sqlConnection.release();
        return Error;
    }
}
export default {
    createTransHistory,
}