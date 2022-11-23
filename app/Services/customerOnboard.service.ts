import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";
import Customer from "../Models/CustomerOnboard/customerOnboard.model";
import {SupplierModel} from "../Models/Supplier/Supplier.model";

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
        // customer address
        if(fields.shipping_state == undefined || fields.shipping_state == null || fields.shipping_state == "") throw new Error("shipping state is required");
        let state_name =fields.shipping_state;
        if(fields.shipping_address == undefined || fields.shipping_address == null || fields.shipping_address == "") throw new Error(" address_type is required");
        // customer_address.address = fields.shipping_address
        if(fields.billing_address == undefined || fields.billing_address == null || fields.billing_address == "") throw new Error("billing address is required");
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        customer_address.latitude=fields.latitude;
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        customer_address.longitude=fields.longitude;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        customer_address.pincode=fields.pincode;
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");
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
        let  user_id = CustomerData.insertId
        let addressB = {"address_type":"billing","address":fields.billing_address,"user_type":0,"user_id":user_id}
        let customerAddress = await new  Customer().createCustomerAddress( addressB )
        let Saddress = {"address_type":"shipping","address":fields.shipping_address,"user_type":0, "user_id":user_id }
        Object.assign(customer_address,Saddress)
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
        let billing:any={};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        customer_details = await new Customer().fetchCustomersDetailsById(fields.id)
        if (customer_details.length == 0) throw new Error("id not found!")
        //  customer details validations
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

        // customer address validatitions
        if(fields.billing_address  == undefined || fields.billing_address == null || fields.billing_address == "") throw new Error(" billing address is required");
        billing.address=fields.billing_address;
        if(fields.shipping_address == undefined || fields.shipping_address == null || fields.shipping_address == "") throw new Error("shipping address is required");
        customer_address.address=fields.shipping_address;
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        customer_address.latitude=fields.latitude;
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        customer_address.longitude=fields.longitude;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        customer_address.pincode=fields.pincode;
        if(fields.shipping_state == undefined || fields.shipping_state == null || fields.shipping_state == "") throw new Error("shipping state is required");
        let state_name =fields.shipping_state;
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");
        customer_address.city_id =fields.shipping_city
        CustomerData = await new Customer().updateCustomersDetails(customer,fields.id)
        let customerBillAddress= await new Customer().updateCustomersAddress(billing ,fields.id, "billing")
        updatedAddress = await new Customer().updateCustomersAddress(customer_address,fields.id, "shipping")
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
        // let address = await new  Customer().fetchCustomerAddress(id)
        let BAddress = await new Customer().fetchsBillingAddressById(id)
        let SAddress = await new  Customer().fetchShippingAddressById(id)
        let city = await new Customer().getCityById(SAddress[0].city_id)
        let state = await new Customer().getStateById(city[0].state_id)
        SAddress[0].shipping_city = city[0].name
        SAddress[0].shipping_state = state[0].name
        delete SAddress[0].city_id
        Object.assign(customers[0],SAddress[0], BAddress[0])
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
        let updated = await new Customer().updateCustomerStatus(data,data.id)
        let update = await new Customer().updateCustomerAddressStatus(data, data.id)
        return {"message":"changed successfully","changedRows":updated.changedRows};
    }catch (e) {
        throw e;
    }

}

const fetchAll = async () => {
    try {
        let customers = await new Customer().fetchAllCustomers()
        if (customers.length == 0) throw new Error(" customer not found!")
        for (let i = 0; i < customers.length; i++) {
            customers[i].gst= config.baseUrl + "/" + customers[0].gstin_url;
            let id = customers[i].id
            let BAddress = await new Customer().fetchsBillingAddressById(id)
            let SAddress = await new  Customer().fetchShippingAddressById(id)
            let city = await new Customer().getCityById(SAddress[0].city_id)
            let state = await new Customer().getStateById(city[0].state_id)
            SAddress[0].shipping_city = city[0].name
            SAddress[0].shipping_state = state[0].name
            delete SAddress[0].city_id
            Object.assign(customers[i], SAddress[0], BAddress[0])
        }
        return customers;
    }
    catch (error: any) {
        return error
    }
}


export default {createCustomer, fetchCustomersById, updateCustomerdetails, updateCustomerstatus, fetchAll}