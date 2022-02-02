import LOGGER from "../config/LOGGER";
import {CustomerModel} from "../Models/Customer/Customer.model";
import moment from 'moment';
import * as path from "path";
import * as fs from "fs";
const {v4 : uuidv4} = require('uuid');
import formidable from "formidable";
import {CustomerBalanceModel} from "../Models/AddBalance/CustomerBalance.model";
import {uploadFile}  from "../utilities/s3FileStore";
import Hashing from "../utilities/Hashing";
import Encryption from "../utilities/Encryption";

const createCustomer = async (req:any,tenant:any) =>{
    try{
        let customerData, fields, s3Path
        let response = await processForm(req);
        if(response instanceof Error) throw response;
        // @ts-ignore
        fields = response.fields;
        // @ts-ignore
        s3Path = response.s3Path;
        // @ts-ignore
        // key=response.key
        console.log("response", response);
        let hash = await new Hashing().generateHash(fields.password, 10);
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
            aadharFront_url: s3Path[0],
            aadharBack_url : s3Path[1],
            pancard_url: s3Path[2],
            selfie_url : s3Path[3],
            pan_number: String(fields.pan_num),
            aadhar_number: String(fields.aadhar_num),
            address: String(fields.address)
        }
        customerData = await new CustomerModel().createCustomer(Customers)
        if (!customerData) throw new Error("Registration failed");
        let addBalance = { balance:0,
        customer_id:customerData.insertId};
        let balanceInfo = await new CustomerModel().addCustomerBalance(addBalance);
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
    for(let i=0;i< customerData.length;i++) {
        delete customerData[i].password;
        delete customerData[i].tenant_id;
    }
    return customerData;
}

const processForm = async(req : any) => {
    let newPath: string [] = [];
    let s3Path:string []=[];
    // let key:string []=[];
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, async (err: any, fields: any, files: any) => {
            const data: any [] = [];
            const data_path: string [] = [];
            try {
                const images = Object.keys(files)
                if (images.length == 0) resolve({fields: fields, s3Path: s3Path});
                    // reject(new Error("No files are uploaded"));
                    for (let i = 0; i < images.length; i++) {
                        data.push(files[images[i]]);
                        data_path[i] = data[i].filepath;
                        // console.log("Into process form--->",data_path[i]);
                        newPath[i] = path.join(__dirname, '../uploads') + '/' + data[i].originalFilename;
                        let rawData = fs.readFileSync(data_path[i]);
                        fs.writeFile(newPath[i], rawData, function (err) {
                            if (err) console.log(err);
                        })
                        // upload file to s3Bucket
                        const result = await uploadFile(data[i]);
                        if (result == 0 && result == undefined) throw new Error("file upload return failed");
                        s3Path[i] = result.Location;
                    }
                    resolve({fields: fields, s3Path: s3Path});
            }catch(e)
            {
                return e
            }
        });
    });
}

const fetchCustomerById = async (id: any, tenant_id:any ) => {
    try {
        let customer = await new CustomerModel().findCustomerById(id, tenant_id);
        if (customer.length == 0) throw new Error("No Customer found");
        // console.log("customer----->",customer);
        const customer_id=id;
        let customer_balance = await new CustomerBalanceModel().getCustomerBalance(customer_id);
        if(customer_balance == 0) throw new Error("Customer BalanceNot found")
        let RecurringDeposit = await new CustomerModel().getCustomerRD(customer_id, tenant_id);
        if(RecurringDeposit.length == 0) throw new Error("RD Not found")
        let FixedDeposit = await new CustomerModel().getCustomerFD(customer_id, tenant_id);
        if(FixedDeposit == 0) throw new Error("FD Not found")
        let shares= 2000;
        customer[0].SavingBalance=customer_balance[0].balance;
        customer[0].RecurringDeposit=RecurringDeposit[0].amount;
        customer[0].FixedDeposit=FixedDeposit[0].amount;
        customer[0].Shares=shares;
        delete customer[0].password;
        delete customer[0].tenant_id;
        return customer[0];
    }
    catch (e){
        return e;
    }
}

const loginCustomer=async (data: any) => {
    try {
        let customer = await new CustomerModel().getCustomer(data.mobile, data.tenant_id);
        if (customer.length === 0) throw new Error("Invalid mobile or tenant_id");
        if(customer[0].status !== 1) throw new Error("Your Account is not active");
        // const otp = Math.floor(100000 + Math.random() * 900000);
        //todo need to integrate sms
        const otp = 123456;
        LOGGER.info(otp);
        data.otp = otp;
        data.customer_id = customer[0].id;
        data.status = customer[0].status;
        data.req_id = uuidv4();
        data.expire_time = moment().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss");
        delete data.mobile;
        data.trials = 3;
        //todo fetch it from config
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

const updateCustomerDetails = async (data:any) => {
    try {
        let customer = await new CustomerModel().updateCustomerDetails(data);
        if (customer.length == 0) throw new Error("customer update failed");
        return customer[0];
    }
    catch (e){
        return e;
    }
}

const fetchTransactionHistoryById = async (customer_id: any) => {

    try {
        let customerHistory = await new CustomerModel().fetchTransactionHistoryById(customer_id);
        if (customerHistory.length == 0) throw new Error("Customers transaction history not found");
        let customer_balance = await new CustomerBalanceModel().getCustomerBalance(customer_id);
        if (customer_balance.length == 0) throw new Error("Couldn't get Customer Balance");
        let CurrentBalance=customer_balance[0].balance;
        for(let i=0;i< customerHistory.length;i++) {
            if (customerHistory[i].credit > 0 && customerHistory[i].credit !== null) {
                customerHistory[i].type = "cr";
                customerHistory[i].Amount = customerHistory[i].credit;
            }else
            if (customerHistory[i].debit < 0 && customerHistory[i].debit !== null) {
                customerHistory[i].type = "db";
                customerHistory[i].Amount = customerHistory[i].debit;
            }
            delete customerHistory[i].debit;
            delete customerHistory[i].credit;
        }
        // console.log("customerHistory----->",customerHistory);
        let BankStatement={
            customerHistory,
            CurrentBalance
        };
        return BankStatement;
    }
    catch (e){
        return e;
    }
}

const formidableUpdateDetails = async (req:any) =>{
    try{
        let hash
        let updatedCustomerData, fields, s3Path
        let updatedResponse = await  processForm(req);
        if(updatedResponse instanceof Error) throw updatedResponse;
        // @ts-ignore
        fields = updatedResponse.fields;
        // @ts-ignore
        s3Path = updatedResponse.s3Path;
        // @ts-ignore
        console.log("updatedResponse", updatedResponse);
        let tenant = req.headers["tenant-id"];
        if(fields.password !== undefined && fields.password !== null && fields.password !== "")  hash = await new Hashing().generateHash(fields.password, 10);
        let id=Number(fields.id);
        console.log("hash---->",hash);
        let updatedCustomers : any = {};
            // first_name: String,
            // middle_name: String,
            // last_name: String,
            // password: String,
            // pancard_url:String,
            // aadhar_url: String,
            // pan_number: String,
            // aadhar_number: String,
            // address: String

        if(fields.f_name !== undefined && fields.f_name !== null && fields.f_name !== "") updatedCustomers.first_name=fields.f_name;

        if(fields.m_name !== undefined && fields.m_name !== null && fields.m_name !== "") updatedCustomers.middle_name=fields.m_name;

        if(fields.l_name !== undefined && fields.l_name !== null && fields.l_name !== "") updatedCustomers.last_name=fields.l_name;

        if(fields.mobile !== undefined && fields.mobile !== null && fields.mobile !== "") updatedCustomers.mobile=fields.mobile;

        if(fields.email !== undefined && fields.email !== null && fields.email !== "") updatedCustomers.email=fields.email;

        if(fields.password !== undefined && fields.password !== null && fields.password !== "") updatedCustomers.password=hash;

        if(fields.dob !== undefined && fields.dob !== null && fields.dob !== "") updatedCustomers.dob=fields.dob;

        if(fields.r_date !== undefined && fields.r_date !== null && fields.r_date !== "") updatedCustomers.reg_date=fields.r_date;

        if(fields.stat !== undefined && fields.stat !== null && fields.stat !== "") updatedCustomers.status=fields.stat;

        if(s3Path[0] !== undefined && s3Path[0] !== null && s3Path[0] !== "") updatedCustomers.pancard_url=s3Path[0];

        if(s3Path[1] !== undefined && s3Path[1] !== null && s3Path[1] !== "") updatedCustomers.aadhar_url=s3Path[1];

        if(fields.pan_num !== undefined && fields.pan_num !== null && fields.pan_num !== "") updatedCustomers.pan_number=fields.pan_num;

        if(fields.aadhar_num !== undefined && fields.aadhar_num !== null && fields.aadhar_num !== "") updatedCustomers.aadhar_number=fields.aadhar_num;

        if(fields.address !== undefined && fields.address !== null && fields.address !== "") updatedCustomers.address=fields.address;

        updatedCustomerData = await new CustomerModel().formidableUpdateDetails(updatedCustomers,id,tenant)
        if (!updatedCustomerData) throw new Error("Update Customer failed");
        return updatedCustomerData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

export default {
    createCustomer,
    fetchAllCustomers,
    loginCustomer,
    verify_customer_otp,
    fetchCustomerById,
    updateCustomerDetails,
    fetchTransactionHistoryById,
    formidableUpdateDetails
}
