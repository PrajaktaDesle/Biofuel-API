import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";
import CustomerModel from "../Models/Customer/customer.model";
import {SupplierModel} from "../Models/Supplier/Supplier.model";

const createCustomer = async (req:any)=> {
    try {
        let CustomerData,fields, files,customer_address;
        let customer: any = {};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        // customer pedetails
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
        if(fields.shipping_address == undefined || fields.shipping_address == null || fields.shipping_address == "") throw new Error(" address_type is required");
        if(fields.billing_address == undefined || fields.billing_address == null || fields.billing_address == "") throw new Error("billing address is required");
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");

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
        CustomerData = await new CustomerModel().createCustomerDetails(customer)
        if(!CustomerData) throw Error("failed to create customer")
        let user_id = CustomerData.insertId
        // customer billing address
        let addressB = {"address_type":"billing","address":fields.billing_address,"user_type":0,"user_id":user_id}
        customer_address = await new CustomerModel().createCustomerAddress(addressB)
        // customer shipping address
        let addressS = {"address_type":"shipping","address":fields.shipping_address,"user_type":0, "user_id":user_id, "latitude":fields.latitude,"longitude":fields.longitude, "pincode":fields.pincode, "city_id":fields.shipping_city }
        customer_address = await new CustomerModel().createCustomerAddress(addressS)
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
        let CustomerData,customer_details,fields, files, customerBillingAddress, customerShippingAddress;

        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        let customer: any = {"status":fields.status}, customer_address:any={"status":fields.status},billing:any={"status":fields.status};
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        customer_details = await new CustomerModel().fetchCustomersDetailsById(fields.id)
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
        CustomerData = await new CustomerModel().updateCustomersDetails(customer,fields.id)
        customerBillingAddress= await new CustomerModel().updateCustomersAddress(billing ,fields.id, "billing")
        customerShippingAddress = await new CustomerModel().updateCustomersAddress(customer_address,fields.id, "shipping")
        return {message:"updated successfully ", CustomerData};
    }catch(e:any){
        console.log("Exception =>", e.message);
        throw e;
    }
}
const fetchCustomersById = async (id:any) => {

    try {
        let customers = await new  CustomerModel().fetchCustomersDetailsById(id)
        if (customers.length == 0) throw new Error(" customer not found!")
        customers[0].gst= config.baseUrl + "/" + customers[0].gstin_url;
        // let address = await new Customer().fetchCustomerAddress(id)
        let BAddress = await new CustomerModel().fetchsBillingAddressById(id)
        let SAddress = await new  CustomerModel().fetchShippingAddressById(id)
        let city = await new CustomerModel().getCityById(SAddress[0].city_id)
        let state = await new CustomerModel().getStateById(city[0].state_id)
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

const fetchAll = async () => {
    let Billing_address, shipping_address, city,state: any;
    try {
        // fetch all active customers
        let customers = await new CustomerModel().fetchAllCustomers()
        if (customers.length == 0) throw new Error(" customer not found!")
        for (let i = 0; i < customers.length; i++) {
            customers[i].gst= config.baseUrl + "/" + customers[0].gstin_url;
            let id = customers[i].id
            Billing_address = await new CustomerModel().fetchsBillingAddressById(id)
            shipping_address = await new  CustomerModel().fetchShippingAddressById(id)
            city = await new CustomerModel().getCityById(shipping_address[0].city_id)
            state = await new CustomerModel().getStateById(city[0].state_id)
            shipping_address[0].shipping_city = city[0].name
            shipping_address[0].shipping_state = state[0].name
            delete shipping_address[0].city_id
            Object.assign(customers[i], shipping_address[0], shipping_address[0])
        }
        return customers;
    }
    catch (error: any) {
        return error
    }
}

// customer-supplier mapping
const CreateCSMService = async(req:any)=>{
    let result, customer, supplier, customer_address;
    let data:any={}
    try{
        if (req.body.customer_id !== undefined &&  req.body.customer_id !== null && req.body.customer_id !== "")
            customer = await new  CustomerModel().fetchCustomers(req.body.customer_id)
        if (customer.length == 0) throw new Error("customer not found");
        // console.log('customers------------------>',customer)
        customer_address = await new CustomerModel().fetchAddressID(req.body.customer_id)
        if (customer_address.length == 0) throw new Error("id not found");
        // console.log('in service customer_address_id------>', customer_address)
        data.address_id = customer_address[0].id
        if (req.body.customer_id !== undefined &&  req.body.customer_id !== null && req.body.customer_id !== "")
            supplier = await new CustomerModel().fetchSupplier(req.body.supplier_id)
        if (supplier.length == 0) throw new Error("Supplier not found");
        data.customer_id = customer[0].id
        data.supplier_id = supplier[0].id
        let CSM = await new CustomerModel().fetchCSM(req.body.customer_id, req.body.supplier_id)
        if(CSM.length !== 0) throw new Error(" id already present")
        result = await new CustomerModel().createCSM(data)
        return {message:"added successfully ",insertId:result.insertId}
    }catch (e) {
        throw e
    }
}

const updateCSMService = async(req:any)=>{
    let result,CSM, data;
    try{

        CSM = await new CustomerModel().fetchCSM(req.body.customer_id,req.body.supplier_id)
        if(CSM.length == 0) throw new Error("id not found");
        data = {"status":req.body.status }
        // console.log("data in service------>", data)
        result = await new CustomerModel().updateStatusById(data, req.body.customer_id,req.body.supplier_id)
        LOGGER.info( "Product details", result )
        console.log( result )
        return {"changedRows":result.changedRows};
    }catch (e) {
        console.log("error----------->",e)
        throw e
    }
}
const fetchAllCSM = async()=>{
    try {
        let result, customer_name, suppiler_name, address;
        result = await new CustomerModel().fetchAll()
        for (let i = 0; i < result.length; i++) {
            customer_name = await new CustomerModel().fetchCustomers(result[i].customer_id)
            suppiler_name = await new CustomerModel().fetchSupplier(result[i].supplier_id)
            address = await new CustomerModel().fetchCity(result[i].address_id)
            let city = await new CustomerModel().fetchCustomerCity(address[0].city_id)
            result[i].customer = customer_name[0].name
            result[i].supplier = suppiler_name[0].name
            result[i].city = city[0].name
            result[i].address =address[0].address
            delete result[i].customer_id
            delete result[i].supplier_id
            delete result[i].address_id
        }
        return result
    }catch (e) {
        throw e
    }
}



export default {createCustomer,
    fetchCustomersById,
    updateCustomerdetails,fetchAll,
    CreateCSMService,updateCSMService, fetchAllCSM
}