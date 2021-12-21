import bcrypt from "bcrypt";
import {CustomerModel} from "../Models/Customer/Customer.model";
import moment from 'moment';
import Encryption from "../utilities/Encryption";

const {v4 : uuidv4} = require('uuid');

const jwt = require('jsonwebtoken');

const generateHash = async (password: string,saltRounds: number,): Promise<string> =>
    new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
            if (!err) {
                resolve(hash);
            }
            reject(err);
        });
    });

// const createUser = async (data : any) => {
//     data.password = await generateHash(data.password, 3);
//     console.log(data)
//     delete data.confirm_password;
//     console.log(data)
//     let cust = await new Cust_Model().createCustomer(data);
//     console.log("User ->>>>", cust);
//     return cust;
// };


async function loginCustomer(data:any) {
    try{
        console.log(111, data)
        let customer = await new CustomerModel().getCustomer(data.mobile, data.tenant_id);
        console.log("Customer", customer);
        if(customer.length === 0) throw new Error("No Such customer exits")
        const otp = Math.floor(100000 + Math.random() * 900000);
        //todo need to integrate sms
        console.log(otp);
        data.otp = otp;
        data.customer_id = customer[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss");
        delete data.mobile;
        console.log(data)
        await new CustomerModel().create_otp(data);
        return {request_id : data.req_id}
    }
    catch(e)
    {
        return e;
    }
}



async function verify_customer_otp(data:any) {
    try{
        console.log(111, data)
        let otp_details = await new CustomerModel().getCust_otp(data);
        if (otp_details.length === 0) throw new Error ("Error in login")
        if (!(data.otp == otp_details[0].otp)) throw  new Error ("Incorrect OTP")
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        if (!(otp_details.expire_time >= now)) throw new Error ("OPT expired")
        otp_details[0].token = await Encryption.generateJwtToken({
            id: otp_details.customer_id,
            tenant_id: otp_details.tenant_id
        });
        console.log("login successful");
        return {otp_details};
        }
    catch(e)
        {
        return e;
        }
}
export default {
    // createUser,
    loginCustomer,
    verify_customer_otp
};
