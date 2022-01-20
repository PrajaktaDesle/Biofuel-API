import LOGGER from "../config/LOGGER";
import {RdModel} from "../Models/Rd/Rd.model";
import moment from "moment";


async function createRd(data: any) {
    try {
        // console.log(data)
        let rdDetail = await new RdModel().get_maturity_amount(data);
        if(rdDetail.length == 0)throw new Error("NO DATA");
        data.maturity_amount = rdDetail[0].maturity_amount;
        console.log("at Rd service", data)
        delete data.transaction_type;
        let customer = await new RdModel().createRd(data);
        console.log("at Rd service------>", customer);
        return customer;
    } catch (e) {
        return e;
    }
}

async function fetchRdByCustomerId(customer_id : any, tenant_id : number) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let rdList = await new RdModel().fetchRd(customer_id, tenant_id);
        // console.log("RD List ",rdList);
        delete rdList[0].customer_id;
        delete rdList[0].tenant_id;
        return rdList;
    } catch (e) {
        return e;
    }
}


async function fetchRdDetailsByTransactionId(transaction_id: any, tenant_id: any) {
    try {
        // console.log("transaction_id :", transaction_id, "tenant-id:", tenant_id);
        let RdDetailsList = await new RdModel().fetchAmountStartDate(transaction_id, tenant_id);
        if(RdDetailsList.length == 0) throw new Error("RD not found");
        let paidEntry = await new RdModel().fetchRdDetails(transaction_id);
        if(paidEntry.length == 0) throw new Error("Didnt get RD Transaction details")
        // console.log("PaidEntry---->",paidEntry.length);
        let remainingMonths = RdDetailsList[0].tenure - paidEntry.length
        let rd_collection:any = 0;
        for(let i=0; i < paidEntry.length; i++)
        {
            rd_collection +=  paidEntry[i].debit
        }
        const RdData:any={
            amount : RdDetailsList[0].amount,
            RdStart_date: RdDetailsList[0].start_date,
            RdEndDate:RdDetailsList[0].start_date,
            rd_id : RdDetailsList[0].id,
            rd_collection,
            remainingMonths,
            paidEntry
        }
        console.log("RD transaction List ",RdData);
        return RdData;
    } catch (e) {
        return e;
    }
}
export default {
    createRd,
    fetchRdByCustomerId,
    fetchRdDetailsByTransactionId,
}
