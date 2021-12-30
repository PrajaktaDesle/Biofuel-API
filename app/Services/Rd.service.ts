import LOGGER from "../config/LOGGER";
import {RdModel} from "../Models/Rd/Rd.model";
import moment from "moment";


async function create_rd(data: any) {
    try {
        console.log(data)
        let rd_detail = await new RdModel().get_maturity_amount(data);
        if(rd_detail.length == 0)throw new Error("NO DATA");
        data.maturing_amount = rd_detail[0].maturing_amount;
        console.log("at Rd service", data)
        delete data.transaction_type;
        let customer = await new RdModel().create_RD(data);
        console.log("at Rd service------>", customer);
        return data;
    } catch (e) {
        return e;
    }
}

async function fetchRdByCustomer(customer_id : any, tenant_id : number) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let rdList = await new RdModel().fetch_RD(customer_id, tenant_id);
        console.log("RD List ",rdList)
        return rdList;
    } catch (e) {
        return e;
    }
}

export default {
    create_rd,
    fetchRdByCustomer
}
