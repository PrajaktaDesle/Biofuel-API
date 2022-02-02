
import {PensionSchemeModel} from "../Models/PensionScheme/PensionScheme.model";

async function createPensionScheme(data: any) {
    try {
        console.log(data)
        let pensionDetail = await new PensionSchemeModel().get_maturity_amount(data);
        if(pensionDetail.length == 0)throw new Error("RD Data did not match");
        data.maturity_amount = pensionDetail[0].maturity_amount;
        console.log("at Pension service", data)
        delete data.transaction_type;
        let customer = await new PensionSchemeModel().createPensionScheme(data);
        console.log("at Pension service------>", customer);
        return customer;
    } catch (e) {
        return e;
    }
}


async function fetchByCustomerId(customer_id: any, tenant_id: any) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let pensionSchemeList = await new PensionSchemeModel().fetchByCustomerId(customer_id, tenant_id);
        console.log("PensionScheme List ",pensionSchemeList);
        delete pensionSchemeList[0].customer_id;
        delete pensionSchemeList[0].tenant_id;
        return pensionSchemeList;
    } catch (e) {
        return e;
    }
}

export default {
    createPensionScheme,
    fetchByCustomerId,
}