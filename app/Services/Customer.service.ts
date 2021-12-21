import async from "async";

import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');
import {CustomerModel} from "../Models/Customer/Customer.model";
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import * as path from "path";
import * as fs from "fs";
import userService from "./User.service";

const generateHash = async (
    password: string,
    saltRounds: number,
): Promise<string> =>
    new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
            if (!err) {
                resolve(hash);
            }
            reject(err);
        });
    });

const createCustomer = async (form : any,tenant:any) =>{
    let customerData;
    form.parse(async (err: any, fields: any, files: any) =>{

    const data: any [] = [];
    const data_path: string [] = [];
    // let fieldData: any [] = []
    let newPath: string [] = []
    const images = Object.keys(files)

    for (let i = 0; i < images.length; i++) {
        data.push(files[images[i]])
        const new_data = data[i]
        data_path[i] = new_data.filepath
        newPath[i] = path.join(__dirname, '../uploads')
            + '/' + data[i].originalFilename
        let rawData = fs.readFileSync(data_path[i])

        fs.writeFile(newPath[i], rawData, function (err) {
            if (err) console.log(err)
        })
async function loginCustomer(data:any) {
    try{
        LOGGER.info(111, data)
        let customer = await new CustomerModel().getCustomer(data.mobile, data.tenant_id);
        LOGGER.info("Customer", customer);
        if(customer.length === 0) throw new Error("No Such customer exits")
        const otp = Math.floor(100000 + Math.random() * 900000);
        //todo need to integrate sms
        LOGGER.info(otp);
        data.otp = otp;
        data.customer_id = customer[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss");
        delete data.mobile;
        LOGGER.info(data)
        await new CustomerModel().create_otp(data);
        return {request_id : data.req_id}
    }
    catch(e)
    {
        return e;
    }
        let hash = await generateHash(fields.password, 10);
        let Customers = {
            first_name: String(fields.f_name),
            middle_name: String(fields.m_name),
            last_name: String(fields.l_name),
            mobile: String(fields.mobile),
            email: String(fields.email),
            password: hash,
            dob: String(fields.dob),
            reg_date: String(fields.r_date),
            user_id: Number(fields.u_id),
            tenant_id: tenant,
            status: Number(fields.stat),
            pancard_url: newPath[0],
            aadhar_url: newPath[1],
            pan_number: String(fields.pan_num),
            aadhar_number: String(fields.aadhar_num),
            address: String(fields.address)
}



async function verify_customer_otp(data:any) {
    try{
        LOGGER.info(111, data)
        let otp_details = await new CustomerModel().getCustomer_otp(data);
        if (otp_details.length === 0) throw new Error ("Error in login")
        if (!(data.otp == otp_details[0].otp)) throw  new Error ("Incorrect OTP")
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        if (!(otp_details.expire_time >= now)) throw new Error ("OPT expired")
        otp_details[0].token = await Encryption.generateJwtToken({
            id: otp_details.customer_id,
            tenant_id: otp_details.tenant_id
        });
        LOGGER.info("login successful");
        return {otp_details};
        }
        console.log("Customers json at services-------->",Customers);
        customerData = await new CustomerModel().createCustomer(Customers)
        if (!customerData) throw new Error("Registration failed");
            console.log("details returned from model------>", customerData)
            return customerData.insertId;
    })
    catch(e)
        {
        return e;
        }
}


const customerDetails = async (data : any) =>{
    let customerData;

customerData = await new CustomerModel().findCustomers(data)
        if (!customerData) throw new Error("details did not match");
        // console.log("details returned from model------>", customerData)
        return customerData;
}

export default {
    createCustomer,
    // loginCustomer,
    customerDetails,
    // createUser,
    loginCustomer,
    verify_customer_otp
};
