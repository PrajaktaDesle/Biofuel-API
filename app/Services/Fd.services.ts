import LOGGER from "../config/LOGGER";
import {FdModel} from "../Models/Fd/Fd.model";
import moment from "moment";


async function create_fd(data: any) {
    try {
        console.log(data)
        let rd_detail = await new FdModel().get_maturity_amount(data);
        if(rd_detail.length == 0)throw new Error("NO DATA");
        data.maturing_amount = rd_detail[0].maturing_amount;
        console.log("at rd service", data)
        delete data.transaction_type;
        let customer = await new FdModel().create_RD(data);
        console.log("at rd service------>", customer);
        return data;
    } catch (e) {
        return e;
    }
}

async function fetchFdByCustomer(data: any) {
    try {
        console.log(data);
        let customer = await new FdModel().get_customer(data);
        console.log(customer);
        return {customer};
    } catch (e) {
        return e;
    }
}

export default {
    create_fd,
    fetchFdByCustomer
}
