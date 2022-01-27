import LOGGER from "../config/LOGGER";
import {FdModel} from "../Models/Fd/Fd.model";
import {CustomerBalanceModel} from "../Models/AddBalance/CustomerBalance.model";
import FdBalHistory from "../Services/BalanceHistory.service";
import moment from "moment";


async function createFD(data: any) {
    try {
        let tcData = await new FdModel().fetchROI(data);
        // console.log("ROI------>", tcData);
        data.roi = tcData[0].roi;
        let customerBalance = await new CustomerBalanceModel().getCustomerBalance(data.customer_id)
        if(customerBalance.length == 0 || undefined) throw new Error("customer balance not found")
        if ((customerBalance[0].balance - data.amount) < 0 ) throw new Error("Insufficient Balance to create FD")
        console.log("data amount----->",data.amount);
        console.log("data----->",data);

        // "customer_id":"1",
        // "amount":-10000,
        // "transaction_type":"FD",
        // "user_id":"101"
        let data1={
            customer_id:data.customer_id,
            amount : -data.amount,
            transaction_type:data.transaction_type,
            user_id:data.user_id
        }
        delete data.transaction_type;
        delete data.user_id;
        let fdDetail = await new FdModel().createFd(data);
        if(fdDetail.length == 0)throw new Error("FD creation Failed");
        let createFdHistory = await FdBalHistory.createTransHistory(data1);
        if(createFdHistory == 0 && createFdHistory == undefined) throw new Error("FD balance deduct failed");
        return fdDetail;
    } catch (e) {
        return e;
    }
}

async function fetchFdByCustomer(tenant_id: any, customer_id: any) {
    try {
        let fdDetail = await new FdModel().fetchFdByCustomer(tenant_id,customer_id);
        //if(fdDetail.length == 0)throw new Error("NO DATA");
        // console.log("at FD_service", fdDetail);
        delete fdDetail[0].tenant_id;
        delete fdDetail[0].customer_id;
        return fdDetail;
    } catch (e) {
        return e;
    }
}

export default {
    createFD,
    fetchFdByCustomer
}