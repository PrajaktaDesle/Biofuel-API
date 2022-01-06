import LOGGER from "../config/LOGGER";
import {AddBalanceModel} from "../Models/AddBalance/AddBalance.model";
import moment from "moment";


async function createTransHistory(data: any) {
    try {
        // console.log(data);
        let customer_balance = await new AddBalanceModel().getCustomerBalance(data.customer_id);
        if (data.debit > 0 && data.debit !== null && data.debit >= customer_balance[0].balance) throw new Error("Insufficient Balance")
        console.log("customer_balance---->",customer_balance[0]);
        data.credit=data.amount;
        if (data.credit > 0 && data.credit !== null)  data.new_balance =  customer_balance[0].balance + data.credit;
        if (data.debit > 0 && data.debit !== null) data.new_balance = (customer_balance[0].balance - data.debit);
        delete data.amount;
        let TransHistDetail = await new AddBalanceModel().createTransactionHistory(data);
        if (TransHistDetail.length == 0) throw new Error("NO DATA");
        console.log("transHistory details------>", TransHistDetail);
        data.customer_balance= data.new_balance;
        delete data.new_balance;
        const customerBalanceInfo = await new AddBalanceModel().updateCustomerBalance(data.customer_id,data.customer_balance);
        if (customerBalanceInfo==false) throw new Error("Balance Update Failed");
        console.log("customer_Balance Info------>", customerBalanceInfo);
        return TransHistDetail;
    }catch (e) {
        return e;
    }
}
export default {
    createTransHistory,
}