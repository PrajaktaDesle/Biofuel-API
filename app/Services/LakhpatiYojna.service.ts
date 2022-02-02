
import {LakhpatiSchemeModel} from "../Models/LakhpatiYojna/LakhpatiYojna.model";


async function createLakhpatiScheme(data: any) {
    try {
        console.log(data)
        let LakhpatiYojnaDetails = await new LakhpatiSchemeModel().get_maturity_amount(data);
        if(LakhpatiYojnaDetails.length == 0)throw new Error("RD Data did not match");
        data.maturity_amount = LakhpatiYojnaDetails[0].maturity_amount;
        console.log("at Rd service", data)
        delete data.transaction_type;
        let customer = await new LakhpatiSchemeModel().createLakhpatiScheme(data);
        console.log("at Rd service------>", customer);
        return customer;
    } catch (e) {
        return e;
    }
}


async function fetchByCustomerId(customer_id: any, tenant_id: any) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let sukanyaYojnaList = await new LakhpatiSchemeModel().fetchByCustomerId(customer_id, tenant_id);
        // console.log("RD List ",rdList);
        delete sukanyaYojnaList[0].customer_id;
        delete sukanyaYojnaList[0].tenant_id;
        return sukanyaYojnaList;
    } catch (e) {
        return e;
    }
}

export default {
    createLakhpatiScheme,
    fetchByCustomerId,
}