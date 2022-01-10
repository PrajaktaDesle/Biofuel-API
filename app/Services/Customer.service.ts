import LOGGER from "../config/LOGGER";
import {CustomerModel} from "../Models/Customer/Customer.model";
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import * as path from "path";
import * as fs from "fs";
const {v4 : uuidv4} = require('uuid');
import formidable from "formidable";
import {any} from "async";
import {AddBalanceModel} from "../Models/AddBalance/AddBalance.model";
const createCustomer = async (req:any,tenant:any) =>{
    try{
        console.log("print data ---->",req)
        let customerData, fields : any, newPath : any
        let response = await processForm(req);
        if(response instanceof Error) throw response;
        // @ts-ignore
        fields = response.fields;
        // @ts-ignore
        newPath = response.newPath;
        console.log("response", response);
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

const fetchAllCustomers = async (tenant_id : any) =>{
    let customerData;
    customerData = await new CustomerModel().findAllCustomers(tenant_id)
    if (customerData == null) throw new Error("details did not match");
    return customerData;
}

const processForm = async(req : any) => {
    let newPath: string [] = [];
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
            const data: any [] = [];
            const data_path: string [] = [];
            const images = Object.keys(files)
            if(images.length == 0) reject(new Error("No files are uploaded"));
            for (let i = 0; i < images.length; i++) {
                data.push(files[images[i]]);
                data_path[i] = data[i].filepath;
                // console.log("Into process form--->",data_path[i]);
                newPath[i] = path.join(__dirname, '../uploads') + '/' + data[i].originalFilename;
                let rawData = fs.readFileSync(data_path[i]);
                fs.writeFile(newPath[i], rawData, function (err) {
                    if (err) console.log(err);
                })
                resolve({fields: fields, newPath : newPath});
            }
        });
    });
}

const fetchCustomerById = async (id: any, tenant_id:any ) => {
    try {
        let customer = await new CustomerModel().findCustomerById(id, tenant_id);
        const customer_id=id;
        let customer_balance = await new AddBalanceModel().getCustomerBalance(customer_id);
        let RecurringDeposit = await new CustomerModel().getCustomerRD(customer_id, tenant_id);
        let FixedDeposit = await new CustomerModel().getCustomerFD(customer_id, tenant_id);
        let shares= 2000;
        customer[0].RecurringDeposit=RecurringDeposit[0].amount;
        customer[0].FixedDeposit=FixedDeposit[0].amount;
        customer[0].SavingBalance=customer_balance[0].balance;
        customer[0].Shares=shares;
        // console.log("customer----->",customer);
        if (customer.length == 0) throw new Error("No Customer");
        return customer[0];
    }
    catch (e){
        return e;
    }
}

const loginCustomer=async (data: any) => {
    try {
        LOGGER.info(111, data);
        let status = await new CustomerModel().getCustomerStatus(data.mobile, data.tenant_id)
        console.log(status);
        if(status[0].status !== 1) throw new Error("Your Account is not active");
        let customer = await new CustomerModel().getCustomer(data.mobile, data.tenant_id);
        // LOGGER.info("Customer", customer);
        if (customer.length === 0) throw new Error("No Such Customer exits");
        // const otp = Math.floor(100000 + Math.random() * 900000);
        //todo need to integrate sms
        const otp = 123456;
        LOGGER.info(otp);
        data.otp = otp;
        data.customer_id = customer[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss");
        delete data.mobile;
        data.trials = 3;
        //todo fetch it from config
        LOGGER.info("Data Before create OTP----->",data);
        console.log("Data Before create OTP----->",data);
        await new CustomerModel().create_otp(data);
        return {request_id: data.req_id};
    } catch (e) {
        return e;
    }
}

const verify_customer_otp = async(data: any) => {
    try {
        LOGGER.info(111, data);
        let otp_details = await new CustomerModel().getCustomer_otp(data);
        console.log(otp_details);
        if (otp_details.length === 0) throw new Error("Error in login");
        if(otp_details[0].trials <= 0) throw new Error("No more trials");
        if (parseInt(data.otp) !== otp_details[0].otp){
            otp_details[0].trials = otp_details[0].trials - 1;
            await new CustomerModel().update_trials(otp_details[0].req_id, otp_details[0].trials)
            throw new Error("Incorrect OTP");
        }
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let expire_time = moment(otp_details[0].expire_time).utc().format("YYYY-MM-DD HH:mm:ss").toString();
        if (!(expire_time >= now)) throw new Error("OTP expired");
        otp_details[0].token = await Encryption.generateJwtToken({
            id: otp_details[0].customer_id,
            tenant_id: otp_details[0].tenant_id
        });
        LOGGER.info("login successful");
        return {token : otp_details[0].token, customer_id: otp_details[0].customer_id};
    }
    catch (e) {
        return e;
    }
}

const updateCustomerById = async (data:any) => {
    try {
        let customer = await new CustomerModel().updateCustomerById(data);
        if (customer.length == 0) throw new Error("No customer");
        return customer[0];
    }
    catch (e){
        return e;
    }
}

const updateCustomerStatus = async (data:any) => {
    try {
        let customer = await new CustomerModel().updateCustomerStatus(data);
        if (customer.length == 0) throw new Error("No customer");
        return customer[0];
    }
    catch (e){
        return e;
    }
}



export default {
    createCustomer,
    fetchAllCustomers,
    loginCustomer,
    verify_customer_otp,
    fetchCustomerById,
    updateCustomerById,
    updateCustomerStatus
}
