import LOGGER from "../config/LOGGER";
import {FdModel} from "../Models/Fd/Fd.model";
import moment from "moment";


async function insertFdInformation(data: any) {
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

async function fetchFdInformation(tenant_id: any, customer_id: any) {
    try {
        let fdDetail = await new FdModel().fetchFd(tenant_id,customer_id);
        if(fdDetail.length == 0)throw new Error("NO DATA");
        // console.log("at FD_service", fdDetail);
        return fdDetail;
    } catch (e) {
        return e;
    }
}

export default {
    insertFdInformation,
    fetchFdInformation
}