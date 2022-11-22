import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";
import Customer from "../Models/CustomerOnboard/customerOnboard.model";

const createCustomer = async (req:any)=> {
    try {
        let CustomerData,fields, files;
        let customer: any = {};
        let customer_address: any ={};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        // console.log('fields---------->', fields)
        // customer details
        if(fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        customer.name=fields.name;
        if(fields.contact_no == undefined || fields.contact_no == null || fields.contact_no == "") throw new Error("mobile is required");
        customer.mobile=fields.contact_no;
        if(fields.email == undefined || fields.email == null || fields.address == "") throw new Error("email is required");
        customer.email=fields.email;
        if(fields.gstin_no == undefined || fields.gstin_no == null || fields.gstin_no == "") throw new Error("gst_no is required");
        customer.gstin=fields.gstin_no;
        if(fields.payment_term== undefined || fields.payment_term == null || fields.payment_term  == "") throw new Error("payment_term is required");
        let payment_term = Number(fields.payment_term)
        customer.payment_term= payment_term;

        if(fields.shipping_state == undefined || fields.shipping_state == null || fields.shipping_state == "") throw new Error("shipping state is required");
        let state_name =fields.shipping_state;
        // customer address
        if(fields.address_type == undefined || fields.address_type == null || fields.address_type == "") throw new Error(" address_type is required");
        customer_address.address_type=fields.address_type;
        if(fields.address == undefined || fields.address == null || fields.address == "") throw new Error("address is required");
        customer_address.address=fields.address;
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        customer_address.latitude=fields.latitude;
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        customer_address.longitude=fields.longitude;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        customer_address.pincode=fields.pincode;
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");
        // const city_name:any = fields.shipping_city
        // const address_city = await new  Customer().fetchCustomerCity(city_name)
        // if(address_city.length == 0) throw new Error(" city id not found")
        customer_address.city_id = fields.shipping_city
        // file validation
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.gstin !== undefined && files.gstin !== null && files.gstin !== "") {
            if (fileNotValid(files.gstin.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image"); s3Image['image'] = files.gstin
        }
        else{ throw new Error("image is required") }
        let name: string = "images/image/" + moment().unix() + "." + s3Image['image'].originalFilename.split(".").pop()
        const result = await uploadFile(s3Image['image'], name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        console.log("s3 result  : ", result)
        s3Path['gstin_url'] = result.key;
        customer= Object.assign(customer, s3Path);
        CustomerData = await new Customer().createModel(customer)
        if(!CustomerData) throw Error("failed to create customer")
        const user_id = CustomerData.insertId
        customer_address.user_id = user_id
        customer_address.user_type = 0 ;
        const address = await new Customer().createCustomerAddress(customer_address)
        return {message:"added successfully ", InsertId:CustomerData.insertId};
    }catch(e:any){
    console.log("Exception =>", e.message);
    throw e;
}
}
const fileNotValid = (type: any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
        return false;
    }
    return true;
};
const updateCustomerdetails = async (req:any)=> {
    try {
        let CustomerData,updatedAddress ,fields, files;
        let customer: any = {};
        let customer_details:any={}
        let customer_address:any={};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        customer_details = await new Customer().fetchCustomersDetailsById(fields.id)
        if (customer_details.length == 0) throw new Error("id not found!")
        // fields validations
        if(fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        customer.name=fields.name;
        if(fields.contact_no == undefined || fields.contact_no == null || fields.contact_no == "") throw new Error("mobile is required");
        customer.mobile=fields.contact_no;
        if(fields.email == undefined || fields.email == null || fields.address == "") throw new Error("email is required");
        customer.email=fields.email;
        if(fields.gstin_no == undefined || fields.gstin_no == null || fields.gstin_no == "") throw new Error("gst_no is required");
        customer.gstin=fields.gstin_no;
        if(fields.status == undefined || fields.status == null || fields.status == "") throw new Error("status is required");
        customer.status=fields.status;
        if(fields.payment_term== undefined || fields.payment_term == null || fields.payment_term  == "") throw new Error("payment_term is required");
        let payment_term = Number(fields.payment_term)
        customer.payment_term= payment_term;
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.gstin !== undefined && files.gstin !== null && files.gstin !== "") {
            if (fileNotValid(files.gstin.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image"); s3Image['image'] = files.gstin
        }
        else{ throw new Error("image is required") }
        let name: string = "images/image/" + moment().unix() + "." + s3Image['image'].originalFilename.split(".").pop()
        const result = await uploadFile(s3Image['image'], name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        console.log("s3 result  : ", result)
        s3Path['gstin_url'] = result.key;
        customer= Object.assign(customer, s3Path);

        // customer address
        if(fields.address_type == undefined || fields.address_type == null || fields.address_type == "") throw new Error(" address_type is required");
        customer_address.address_type=fields.address_type;
        if(fields.address == undefined || fields.address == null || fields.address == "") throw new Error("address is required");
        customer_address.address=fields.address;
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        customer_address.latitude=fields.latitude;
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        customer_address.longitude=fields.longitude;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        customer_address.pincode=fields.pincode;
        if(fields.shipping_state == undefined || fields.shipping_state == null || fields.shipping_state == "") throw new Error("shipping state is required");
        let state_name =fields.shipping_state;
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");
        // const city_name:any = fields.city
        // const address_city = await new CustomerOnboard().fetchCustomerCity(city_name)
        // if(address_city.length == 0) throw new Error(" city id not found")
        customer_address.city_id =fields.shipping_city
        CustomerData = await new Customer().updateCustomersDetails(customer,fields.id)
        updatedAddress = await new  Customer().updateCustomersAddress(customer_address,fields.id)
        return {message:"updated successfully ", CustomerData};
    }catch(e:any){
        console.log("Exception =>", e.message);
        throw e;
    }
}
const fetchCustomersById = async (id:any) => {

    try {
        let customers = await new  Customer().fetchCustomersDetailsById(id)
        if (customers.length == 0) throw new Error(" customer not found!")
        customers[0].gst= config.baseUrl + "/" + customers[0].gstin_url;
        let address = await new  Customer().fetchCustomerAddress(id)
        Object.assign(customers[0],address[0])
        return customers[0];
    }
    catch (error: any) {
        return error
    }

}
//update customer status
const updateCustomerstatus = async (data:any)=>{
    try {
        let customer = await new  Customer().fetchCustomersDetailsById(data.id)
        if (customer.length == 0) throw new Error("customer not found")
        let updatedStatus = await new Customer().updateCustomerStatus(data,data.id)
        let update = await new Customer().updateCustomerAddressStatus(data, data.id)
        return {message:"deleted successfully"}
    }catch (e) {
        throw e;
    }

}

const fetchAll = async () => {
    try {
        let customers = await new  Customer().fetchAllCustomers()
        if (customers.length == 0) throw new Error(" customer not found!")
        // customers[0].gst= config.baseUrl + "/" + customers[0].gstin_url;
        let address = await new Customer().fetchAllAddress()
        Object.assign(customers[0],address[0])
        return customers;
    }
    catch (error: any) {
        return error
    }

}


export default {createCustomer, fetchCustomersById, updateCustomerdetails, updateCustomerstatus, fetchAll}