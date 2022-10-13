import {SupplierModel} from "../Models/Supplier/Supplier.model";
import {uploadFile}  from "../utilities/S3Bucket";
const {v4 : uuidv4} = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";

const createSupplier = async (req:any) =>{
    try{
        let supplierData, fields, files;
        let supplier:any = {};
        
        // Formidable
        let response : any = await processForm(req);
        if(response instanceof Error) throw response;
        fields = response.fields;
        files = response.files;
        
        // Fields validation
        if(fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        supplier.name=fields.name;
        if(fields.address == undefined || fields.address == null || fields.address == "") throw new Error("address is required");
        supplier.address=fields.address;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pincode is required");
        supplier.pincode=fields.pincode;
        if(fields.city == undefined || fields.city == null || fields.city == "") throw new Error("city is required");
        supplier.city=fields.city;      
        if(fields.user_id == undefined || fields.user_id == null || fields.user_id == "") throw new Error("user_id is required");  
        supplier.user_id=fields.user_id;
        if(fields.status == undefined || fields.status == null || fields.status == "") throw new Error("status is required");
        supplier.status=fields.status;
        if(fields.aadhar_no == undefined || fields.aadhar_no == null || fields.aadhar_no == "") throw new Error("aadhar_no is required");
        supplier.aadhar_no=fields.aadhar_no;
        if(fields.gst_no == undefined || fields.gst_no == null || fields.gst_no == "") throw new Error("gst_no is required");
        supplier.gst_no=fields.gst_no;
        if(fields.pan_no == undefined || fields.pan_no == null || fields.pan_no == "") throw new Error("pan_no is required");
        supplier.pan_no=fields.pan_no;

        // Files validation
        if(files.aadhar_img == undefined || files.aadhar_img == null || files.aadhar_img == '') throw new Error("aadhar_img is required");
        supplier.aadhar_url = files.aadhar_img;
        if(files.pan_img == undefined || files.pan_img == null || files.pan_img == '') throw new Error("pan_img is required")
        supplier.pan_url = files.pan_img;
        if(files.gst_img == undefined || files.gst_img == null || files.gst_img == '') throw new Error("gst_img is required");
        supplier.gst_url = files.gst_img;
       
        // suppler data send to model
        supplierData = await new SupplierModel().createSupplier(supplier)
        return supplierData;

    }catch(e){
        console.log("Exception =>", e);
        throw e;
    }
}

const fetchAllSuppliers = async ( ) =>{
    let supplierData;
    supplierData = await new SupplierModel().fetchAllSuppliers()
    if (supplierData == null) throw new Error("details did not match");

    // Adding Baseurl to panurl from database
    for(let i=0;i< supplierData.length;i++) {
        supplierData[i].pan_url= config.baseUrl + "/" + supplierData[i].panurl;
        supplierData[i].aadhar_url= config.baseUrl + "/" + supplierData[i].aadhar_url;
        supplierData[i].gst_url = config.baseUrl + "/" + supplierData[i].gst_url;
    }
    return supplierData;
}

const processForm = async(req : any) => {
    let files:any = {};
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, async (err: any, fields: any, files: any) => {
            try {
                const images:any = Object.keys(files)
                console.log("Key value of images----->",images);
                if (images.length == 0) resolve({fields: fields, files: files});
                    for (let i = 0; i < images.length; i++) {
                        // upload file to s3Bucket
                        let name : string = "images/"+images[i]+"/"+  moment().unix() + "."+ files[images[i]].originalFilename.split(".").pop()
                        const result = await uploadFile(files[images[i]], name);
                        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
                        console.log(images[i])
                        files[images[i]] = result.key;
                    }
                    console.log(files)
                    resolve({fields: fields, files: files});
            }catch(e)
            {
                throw e
            }
        });
    });
}

const fetchSupplierById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchSupplierById(id);
        if (supplier.length == 0) throw new Error("No supplier found");
        console.log("supplier----->",supplier);
    
        // Adding Baseurl to panurl from database
        supplier[0].pan_url= config.baseUrl + "/" + supplier[0].pan_url;
        supplier[0].aadhar_url= config.baseUrl + "/" + supplier[0].aadhar_url;
        supplier[0].gst_url= config.baseUrl + "/" + supplier[0].gst_url;

        return supplier[0];
    }
    catch (e){
        return e;
    }
}



const updateSupplierDetails = async (data:any) => {
    try {
        let supplier = await new SupplierModel().updateSupplierDetails(data);
        if (supplier.length == 0) throw new Error("supplier updatation failed");
        return supplier[0];
    }
    catch (e){
        throw e;
    }
}

const formidableUpdateDetails = async (req:any) =>{
    try{
        let hash
        let updatedSupplierData, fields, files
        let updatedResponse : any = await processForm(req);
        if(updatedResponse instanceof Error) throw updatedResponse;
        fields = updatedResponse.fields;
        files = updatedResponse.files;
        console.log("updatedResponse", updatedResponse);
        let id=Number(fields.id);
        let updatedSupplier : any = {};

        // id field validation
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");

        // Fields validation
        if(fields.name !== undefined && fields.name !== null && fields.name !== "") 
        updatedSupplier.name=fields.name;
        if(fields.address !== undefined && fields.address !== null && fields.address !== "")
        updatedSupplier.address=fields.aaddress;
        if(fields.city !== undefined && fields.city !== null && fields.city !== "") 
        updatedSupplier.city=fields.city;
        if(fields.pincode !== undefined && fields.pincode !== null && fields.pincode !== "") 
        updatedSupplier.pincode=fields.pincode;
        if(fields.latitude !== undefined && fields.latitude !== null && fields.latitude !== "") 
        updatedSupplier.latitude=fields.latitude;
        if(fields.longitude !== undefined && fields.longitude !== null && fields.longitude !== "") 
        updatedSupplier.longitude=fields.longitude;
        if(fields.status !== undefined && fields.status !== null && fields.status !== "") 
        updatedSupplier.status=fields.status
        if(fields.aadhar_no !== undefined && fields.aadhar_no !== null && fields.aadhar_no !== "") 
        updatedSupplier.aadhar_no=fields.aadhar_no;
        if(fields.pan_no !== undefined && fields.pan_no !== null && fields.pan_no !== "") 
        updatedSupplier.pan_no=fields.pan_no;
        if(fields.address !== undefined && fields.address !== null && fields.address !== "") 
        updatedSupplier.address=fields.address;
 
        // Files validation
        if(files.aadhar_img !== undefined && files.aadhar_img !== null && files.aadhar_img !== "") 
        updatedSupplier.aadhar_url=files.aadhar_img;
        if(files.pan_img !== undefined && files.pan_img !== null && files.pan_img !== "") 
        updatedSupplier.pan_url=files.pan_img;
        if(files.gst_img !== undefined && files.gst_img !== null && files.gst_img !== "") 
        updatedSupplier.gst_url=files.gst_img;
     
        // console.log("updatedCustomers ---->", updatedCustomers);
        updatedSupplierData = await new SupplierModel().formidableUpdateDetails(updatedSupplier,id)
        if (!updatedSupplierData) throw new Error("Supplier updation failed.");
        return updatedSupplierData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

export default {
    createSupplier,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSupplierDetails,
    formidableUpdateDetails
}
