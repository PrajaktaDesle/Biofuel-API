import async from "async";

import bcrypt from "bcrypt";
import LOGGER from "../config/LOGGER";
const jwt = require('jsonwebtoken');
import {CustomerModel} from "../Models/Customer/Customer.model";
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import * as path from "path";
import * as fs from "fs";
const {v4 : uuidv4} = require('uuid');
import userService from "./User.service";
import formidable from "formidable";

// const generateHash = async (
//     password: string,
//     saltRounds: number,
// ): Promise<string> =>
//     new Promise((resolve, reject) => {
//         bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
//             if (!err) {
//                 resolve(hash);
//             }
//             reject(err);
//         });
//     });
//
// const createCustomer = async (form : any,tenant:any) =>{
//     let customerData;
//     form.parse(async (err: any, fields: any, files: any) => {

const createCustomer = async (req:any,tenant:any) =>{
    try{
        let customerData, fields: any, newPath :any;
        let response = await processForm(req);
        // @ts-ignore
        fields = response.fields;
        // @ts-ignore
        newPath = response.newPath;
        // console.log("response", response);
        let hash = await new Encryption().generateHash(fields.password, 10);
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
        customerData = await new CustomerModel().createCustomer(Customers)
        // console.log("details returned from model  1------>", customerData)
        if (!customerData) throw new Error("Registration failed");
        // console.log("details returned from model  2------>", customerData)
        return customerData;
    }catch(e){
        console.log("Execption ->", e);
        throw e;
    }
}

const customerDetails = async (data : any) =>{
    let customerData;
customerData = await new CustomerModel().findCustomers(data)
        if (customerData == null) throw new Error("details did not match");
        // console.log("details returned from model------>", customerData)
        return customerData;
}

const processForm = async(req : any) => {
    let newPath: string [] = [];
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
            const data: any [] = [];
            const data_path: string [] = [];
            // let fieldData: any [] = []
            const images = Object.keys(files)
            for (let i = 0; i < images.length; i++) {
                data.push(files[images[i]])
                // const new_data = data[i]
                data_path[i] = data[i].filepath
                newPath[i] = path.join(__dirname, '../uploads')
                    + '/' + data[i].originalFilename
                let rawData = fs.readFileSync(data_path[i])
                fs.writeFile(newPath[i], rawData, function (err) {
                    if (err) console.log(err)
                    // reject({error : Error});
                })
                resolve({fields: fields, newPath : newPath});
            }
        });
    })
}


async function loginCustomer(data: any) {
    try {
        LOGGER.info(111, data)
        let customer = await new CustomerModel().getCustomer(data.mobile, data.tenant_id);
        LOGGER.info("Customer", customer);
        if (customer.length === 0) throw new Error("No Such customer exits")
        const otp = Math.floor(100000 + Math.random() * 900000);
        //todo need to integrate sms
        LOGGER.info(otp);
        data.otp = otp;
        data.customer_id = customer[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss");
        delete data.mobile;
        LOGGER.info(data)
        console.log(data)
        await new CustomerModel().create_otp(data);
        return {request_id: data.req_id}
    } catch (e) {
        return e;
    }
}
async function verify_customer_otp(data: any) {
    try {
        LOGGER.info(111, data)
        let otp_details = await new CustomerModel().getCustomer_otp(data);
        if (otp_details.length === 0) throw new Error("Error in login")
        if (!(data.otp == otp_details[0].otp)) throw  new Error("Incorrect OTP")
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let expire_time = moment(otp_details[0].expire_time).utc().format("YYYY-MM-DD HH:mm:ss").toString()
        if (!(expire_time >= now)) throw new Error("OTP expired")
        otp_details[0].token = await Encryption.generateJwtToken({
            id: otp_details.customer_id,
            tenant_id: otp_details.tenant_id
        });
        LOGGER.info("login successful");
        return {token : otp_details[0].token};
    }
    catch (e) {
        return e;
    }
}

export default {
    createCustomer,
    customerDetails,
    loginCustomer,
    verify_customer_otp
}



