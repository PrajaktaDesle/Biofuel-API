
import {SukanyaSchemeModel} from "../Models/SukanyaYojna/SukanyaScheme.model";


async function createSukanyaScheme(data: any) {
    try {
        console.log(data)
        let sukanyaDetail = await new SukanyaSchemeModel().get_maturity_amount(data);
        if(sukanyaDetail.length == 0)throw new Error("RD Data did not match");
        data.maturity_amount = sukanyaDetail[0].maturity_amount;
        console.log("at Sukanya service", data)
        delete data.transaction_type;
        let customer = await new SukanyaSchemeModel().createSukanyaScheme(data);
        console.log("at Sukanya service------>", customer);
        return customer;
    } catch (e) {
        return e;
    }
}


async function fetchByCustomerId(customer_id: any, tenant_id: any) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let sukanyaSchemeList = await new SukanyaSchemeModel().fetchByCustomerId(customer_id, tenant_id);
        console.log("SukanyaYojna List ",sukanyaSchemeList);
        delete sukanyaSchemeList[0].customer_id;
        delete sukanyaSchemeList[0].tenant_id;
        return sukanyaSchemeList;
    } catch (e) {
        return e;
    }
}

export default {
    createSukanyaScheme,
    fetchByCustomerId,
}