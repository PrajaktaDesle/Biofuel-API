import LOGGER from "../config/LOGGER";
import {CustomerBalanceModel} from "../Models/AddBalance/CustomerBalance.model";
import {PoolConnection} from "mysql2";

async function createTransHistory(data: any) {
    let sqlConnection: PoolConnection;
    let customerBalModel = new CustomerBalanceModel();
    //Get Connection
     // @ts-ignore
    sqlConnection = await customerBalModel._getConnection();
    try {
        //Begin Transaction
        // @ts-ignore
        await sqlConnection.beginTransaction();
        let customer_balance = await customerBalModel.getCustomerBalanceLock(sqlConnection, data.customer_id);
        if ((data.amount < 0) && ((customer_balance[0].balance + data.amount) < 0) ) throw new Error("Insufficient Balance");
        data.new_balance =  customer_balance[0].balance + data.amount;
        console.log("new_balance",data.new_balance);
        if (data.amount > 0 && data.amount !== null){
            data.credit = data.amount;
        }else{
            data.debit = data.amount;
        }
        delete data.amount;
        let TransHistDetail = await customerBalModel.createTransactionHistory(sqlConnection, data);
        const customerBalanceInfo = await customerBalModel.updateCustomerBalance(sqlConnection, data.customer_id, data.new_balance);
        // Commit Transaction
        await sqlConnection.commit();
        await sqlConnection.release();
        console.log("Completes")
        return TransHistDetail;
    }catch (Error) {
        console.log("Error inAdd-fund", Error)
        // Rollback Transaction
        // if(sqlConnection !== null )
        // @ts-ignore
        sqlConnection.rollback();
        sqlConnection.release();
        console.log("catchBlock");
        return Error;
    }
}
export default {
    createTransHistory,
}