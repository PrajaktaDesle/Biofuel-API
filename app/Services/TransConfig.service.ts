import LOGGER from "../config/LOGGER";
import {TcModel} from "../Models/TransConfig/TransConfig.model";
import moment from "moment";


async function createTransInformation(data: any) {
    try {
        console.log(data)
        let tcDetail = await new TcModel().createTc(data);
        if(tcDetail.length == 0)throw new Error("NO DATA");
        console.log("at TC_service", tcDetail)
        return tcDetail;
    } catch (e) {
        return e;
    }
}

async function fetchTransInformation(tenant_id: any, type: any) {
    try {
        // console.log(data)
        let tcDetail = await new TcModel().fetchTc(tenant_id,type);
        if(tcDetail.length == 0)throw new Error("NO DATA");
        console.log("at TC_service", tcDetail)
        return tcDetail;
    } catch (e) {
        return e;
    }
}

export default {
    createTransInformation,
    fetchTransInformation
}