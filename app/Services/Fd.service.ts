import LOGGER from "../config/LOGGER";
import {FdModel} from "../Models/Fd/Fd.model";
import moment from "moment";


async function createFD(data: any) {
    try {
        // console.log(data);
        let fdDetail = await new FdModel().createFd(data);
        if(fdDetail.length == 0)throw new Error("NO DATA");
        console.log("at FD_service", fdDetail)
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
        return fdDetail;
    } catch (e) {
        return e;
    }
}

export default {
    createFD,
    fetchFdByCustomer
}