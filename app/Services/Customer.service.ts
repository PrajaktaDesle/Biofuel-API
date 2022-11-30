import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import moment from 'moment';
import * as fs from "fs";
import { CustomerModel } from "../Models/Customer/Customer.model";
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
        if(fields.shipping_address == undefined || fields.shipping_address == null || fields.shipping_address == "") throw new Error(" address_type is required");
        if(fields.billing_address == undefined || fields.billing_address == null || fields.billing_address == "") throw new Error("billing address is required");
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "")
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "")
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pin code is required");
        if(fields.shipping_city == undefined || fields.shipping_city == null || fields.shipping_city == "") throw new Error(" city is required");

        // file validation
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.gstin !== undefined && files.gstin !== null && files.gstin !== "") {
            if (fileNotValid(files.gstin.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image");s3Image['image'] = files.gstin
        }
        else {throw new Error(" gst_url is required")}
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
        let CustomerData,customer_details,fields, files, payment_term, state_name;
        let customer: any = {}, customerBillingAddress:any={},customerShippingAddress:any={};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        customer_details = await new CustomerModel().fetchCustomersDetailsById(fields.id)
        if (customer_details.length == 0) throw new Error("id not found!")
        //  customer details validations
        if(fields.status !== undefined && fields.status !== null && fields.status !== "")
        customer.status = fields.status
        if(fields.name !== undefined && fields.name !== null && fields.name !== "")
        customer.name=fields.name;
        if(fields.contact_no !== undefined && fields.contact_no !== null && fields.contact_no !== "")
        customer.mobile=fields.contact_no;
        if(fields.email !== undefined && fields.email !== null && fields.address !== "")
        customer.email=fields.email;
        if(fields.gstin_no !== undefined && fields.gstin_no !== null && fields.gstin_no !== "")
        customer.gstin=fields.gstin_no;
        if(fields.payment_term !== undefined && fields.payment_term !== null && fields.payment_term  !== "")
        // payment_term = Number(fields.payment_term)
        customer.payment_term= fields.payment_term;
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.gstin !== undefined && files.gstin !== null && files.gstin !== "") {
            if (fileNotValid(files.gstin.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image");else{s3Image['image'] = files.gstin
        }
        let name: string = "images/image/" + moment().unix() + "." + s3Image['image'].originalFilename.split(".").pop()
        const result = await uploadFile(s3Image['image'], name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        console.log("s3 result  : ", result)
        s3Path['gstin_url'] = result.key;
        customer= Object.assign(customer, s3Path);}

        if(fields.billing_address  !== undefined && fields.billing_address !== null && fields.billing_address !== "")
        customerBillingAddress.address=fields.billing_address;
        if(fields.shipping_address !== undefined && fields.shipping_address !== null && fields.shipping_address !== "")
        customerShippingAddress.address=fields.shipping_address;
        if(fields.latitude !== undefined && fields.latitude !== null && fields.latitude !== "")
        customerShippingAddress.latitude=fields.latitude;
        if(fields.longitude !== undefined && fields.longitude !== null && fields.longitude !== "")
        customerShippingAddress.longitude=fields.longitude;
        if(fields.pincode !== undefined && fields.pincode !== null && fields.pincode !== "")
        customerShippingAddress.pincode=fields.pincode;
        if(fields.shipping_state !== undefined && fields.shipping_state !== null && fields.shipping_state !== "")
         state_name =fields.shipping_state;
        if(fields.shipping_city !== undefined && fields.shipping_city !== null && fields.shipping_city !== "")
        customerShippingAddress.city_id =fields.shipping_city
        if( Object.keys(customer).length){await new CustomerModel().updateCustomersDetails(customer,fields.id).then((data)=>{console.log("updated successfully")})}
        if( Object.keys(customerBillingAddress).length){await new CustomerModel().updateCustomersAddress(customerBillingAddress ,fields.id, "billing").then((data)=>{console.log("updated billing address")})}
        if( Object.keys(customerShippingAddress).length) await new CustomerModel().updateCustomersAddress(customerShippingAddress,fields.id, "shipping").then((data)=>{console.log("shipping address updated successfully")})
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
        customers[0].imgList = [{file : customers[0].gstin_url}]
        customers[0].city = {label : customers[0].city , value : customers[0].city_id};
        customers[0].state = {label : customers[0].state , value : customers[0].state_id};
        if (customers[0].status == 1){
            customers[0].customerStatus = {value : 1, label : "Active"};
        }else{
            customers[0].customerStatus = {value : 0, label : "Inactive"};
        }
        return customers[0];
    }
    catch (error: any) {
        return error
    }

}

const fetchAll = async () => {
    // let Billing_address, shipping_address, city,state: any;
    try {
        let customers = await new CustomerModel().fetchAllCustomers()

        if (customers.length == 0) throw new Error(" customer not found!")
        for (let i = 0; i < customers.length; i++) {
            // adding base url to panurl from database
            customers[i].gst= config.baseUrl + "/" + customers[0].gstin_url;
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
        customer_address = await new CustomerModel().fetchAddressID(req.body.customer_id)
        if (customer_address.length == 0) throw new Error("id not found");
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

const createCustomerEstimate = async (data: any) => {
    try {
        let customerData;
        let estimate:any = {};
        if(data.customer !== undefined && data.customer !== null && data.customer !== "")
        estimate.customer_id=data.customer;

        if(data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "")
        estimate.estimate_no=data.estimate_id;

        if(data.product !== undefined && data.product !== null && data.product !== "")
        estimate.product_id=data.product;

        if(data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "")
        estimate.estimate_date=data.estimate_date;

        if(data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "")
        estimate.expiry_date=data.expiry_date;

        if(data.estimate !== undefined && data.estimate !== null && data.estimate !== "")
        estimate.estimate_id=data.estimate;

        if(data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
        estimate.raw_material_id=data.raw_material;

        if(data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
        estimate.packaging_id=data.packaging;

        if(data.estimate_description !== undefined && data.estimate_description !== null && data.estimate_description !== "")
        estimate.estimate_description=data.estimate_description;

        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
        estimate.quantity=data.quantity;

        if(data.rate !== undefined && data.rate !== null && data.rate !== "")
        estimate.rate=data.rate;

        if(data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
        estimate.adjustment_amount=data.adjustment;

        if(data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
        estimate.customer_note=data.customer_note;

        if(data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
        estimate.tnc=data.tnc;

        if(data.status !== undefined && data.status !== null && data.status !== "")
        estimate.status=data.status;

        let estimateData = await new CustomerModel().createCustomerEstimate(estimate)
        return estimateData;

    } catch (e: any) {
        console.log("Exception =>", e.message);
        throw e;
    }
}

const updateCustomerEstimate = async (data: any) => {
    try {
        let estimate:any = {}, est:any;

        if(data.id !== undefined && data.id !== null && data.id !== "")
        est= await new CustomerModel().estimateExistsOrNot(data.id);
        if (est.length == 0 ) throw new Error( "Estimate not found" )


        if(data.customer !== undefined && data.customer !== null && data.customer !== "")
        estimate.customer_id=data.customer;

        if(data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "")
        estimate.estimate_no=data.estimate_id;

        if(data.product !== undefined && data.product !== null && data.product !== "")
        estimate.product_id=data.product;

        if(data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "")
        estimate.estimate_date=data.estimate_date;

        if(data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "")
        estimate.expiry_date=data.expiry_date;

        if(data.estimate !== undefined && data.estimate !== null && data.estimate !== "")
        estimate.estimate_id=data.estimate;

        if(data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
        estimate.raw_material_id=data.raw_material;

        if(data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
        estimate.packaging_id=data.packaging;

        if(data.estimate_description !== undefined && data.estimate_description !== null && data.estimate_description !== "")
        estimate.estimate_description=data.estimate_description;

        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
        estimate.quantity=data.quantity;

        if(data.rate !== undefined && data.rate !== null && data.rate !== "")
        estimate.rate=data.rate;

        if(data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
        estimate.adjustment_amount=data.adjustment;

        if(data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
        estimate.customer_note=data.customer_note;

        if(data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
        estimate.tnc=data.tnc;

        if(data.status !== undefined && data.status !== null && data.status !== "")
        estimate.status=data.status;

        let estimateData:any = await new CustomerModel().updateCustomerEstimateById(estimate, data.id )
        return estimateData;

    } catch (e: any) {
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fetchCustomerEstimateById = async (id: number) => {

    try {
        let estimate = await new CustomerModel().fetchCustomerEstimateById(id)
        if (estimate.length == 0) {
            throw new Error("estimate not found!")
        }

        return estimate;

    }
    catch (error: any) {
        return error
    }

}

const fetchAllCustomerEstimates = async () => {

    try {
        let estimates = await new CustomerModel().fetchAllCustomerEstimates()
        if( estimates.length == 0 ){
            throw new Error( "Estimates not found")
        }

        return estimates;

    }
    catch (error: any) {
        return error
    }

}


export default {
    createCustomer,
    fetchCustomersById,
    updateCustomerdetails,
    fetchAll,
    CreateCSMService,
    updateCSMService,
    fetchAllCSM,
    createCustomerEstimate,
    updateCustomerEstimate,
    fetchCustomerEstimateById,
    fetchAllCustomerEstimates

}
