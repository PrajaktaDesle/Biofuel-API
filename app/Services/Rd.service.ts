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
        console.log("RD List ",rdList)
        return rdList;
    } catch (e) {
        return e;
    }
}

export default {
    createRd,
    fetchRdByCustomerId
}
