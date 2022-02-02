
import {SukanyaYojnaModel} from "../Models/SukanyaYojna/SukanyaYojna.model";


async function createSukanyaYojna(data: any) {
    // try {
    //     console.log(data)
    //     let rdDetail = await new SukanyaYojnaModel().get_maturity_amount(data);
    //     if(rdDetail.length == 0)throw new Error("RD Data did not match");
    //     data.maturity_amount = rdDetail[0].maturity_amount;
    //     console.log("at Rd service", data)
    //     delete data.transaction_type;
    //     let customer = await new SukanyaYojnaModel().createSukanyaYojna(data);
    //     console.log("at Rd service------>", customer);
    //     return customer;
    // } catch (e) {
    //     return e;
    // }
}


async function fetchByCustomerId(customer_id: any, tenant_id: any) {
    try {
        console.log("customer_id :", customer_id, "tenant-id:", tenant_id);
        let sukanyaYojnaList = await new SukanyaYojnaModel().fetchByCustomerId(customer_id, tenant_id);
        console.log("SukanyaYojna List ",sukanyaYojnaList);
        delete sukanyaYojnaList[0].customer_id;
        delete sukanyaYojnaList[0].tenant_id;
        return sukanyaYojnaList;
    } catch (e) {
        return e;
    }
}

export default {
    createSukanyaYojna,
    fetchByCustomerId,
}