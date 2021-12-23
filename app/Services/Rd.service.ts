import LOGGER from "../config/LOGGER";
import {RdModel} from "../Models/Rd/Rd.model";
import moment from "moment";


async function create_rd(data: any) {
    try {
        console.log(data)
        let rd_detail = await new RdModel().get_maturity_amount(data);
        if(rd_detail.length == 0)throw new Error("NO DATA");
        data.maturing_amount = rd_detail[0].maturing_amount;
        console.log("at rd service", data)
        delete data.transaction_type;
        let customer = await new RdModel().create_RD(data);
        console.log("at rd service------>", customer);
        return data;
    } catch (e) {
        return e;
    }
}

async function fetchRdByCustomer(data: any) {
    try {
        console.log(data);
        let customer = await new RdModel().get_customer(data);
        console.log(customer);
        return {customer};
    } catch (e) {
        return e;
    }
}

export default {
    create_rd,
    fetchRdByCustomer
}
