import {SupplierModel} from "../Models/Supplier/Supplier.model";
import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
const {v4 : uuidv4} = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";
import e from "express";
import Encryption from "../utilities/Encryption";

const createSupplier = async (req:any) =>{
    try{
        let suppliersData, suppliersProfile, suppliersAddress, fields, files;
        let supplier:any = {};
        let profile:any = {};
        let address:any = {};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                    resolve({fields: fields, files: files});})}));
        
        // Fields validation
        if(fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        supplier.name=fields.name;
        if(fields.mobile == undefined || fields.mobile == null || fields.mobile == "") throw new Error("mobile is required");
        supplier.mobile=fields.mobile;
        if(fields.address == undefined || fields.address == null || fields.address == "") throw new Error("address is required");
        address.address=fields.address;
        if(fields.pincode == undefined || fields.pincode == null || fields.pincode == "") throw new Error("pincode is required");
        address.pincode=fields.pincode;
        if(fields.city == undefined || fields.city == null || fields.city == "") throw new Error("city is required");
        address.city=fields.city;      
        if(fields.aadhaar_no == undefined || fields.aadhaar_no == null || fields.aadhaar_no == "") throw new Error("aadhaar_no is required");
        profile.aadhaar_no=fields.aadhaar_no;
        if(fields.gstin_no == undefined || fields.gstin_no == null || fields.gstin_no == "") throw new Error("gstin_no is required");
        profile.gstin_no=fields.gstin_no;
        if(fields.pan_no == undefined || fields.pan_no == null || fields.pan_no == "") throw new Error("pan_no is required");
        profile.pan_no=fields.pan_no;
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "") throw new Error("longitude is required");
        profile.longitude=fields.longitude;
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "") throw new Error("latitude is required");
        profile.latitude=fields.latitude
       
        // Files validation
        let s3Images:any = [];
        if(files.aadhaar_img !== undefined && files.aadhaar_img !== null && files.aadhaar_img !== ""){
        if(isFileValid(files.aadhaar_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_img");s3Images['aadhaar_img'] = files.aadhaar_img}
        else{throw new Error("aadhaar_img is required")}

        if(files.pan_img !== undefined && files.pan_img !== null && files.pan_img !== ""){
        if(isFileValid(files.pan_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for pan_img");s3Images['pan_img'] = files.pan_img}
        else{throw new Error("pan_img is required")}

        if(files.gstin_img !== undefined && files.gstin_img !== null && files.gstin_img !== ""){
        if(isFileValid(files.gstin_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for gstin_img");s3Images['gstin_img'] = files.gstin_img}
        else{throw new Error("gstin_img is required")}
        
        // role_id for supplier is 4
        supplier.role_id = 4;

        // Multiple files upload to s3Bucket
        const s3Paths = await uploadFiles( s3Images )
        profile = Object.assign(profile, s3Paths);

        suppliersData = await new SupplierModel().createUser( supplier )
        let user_id = suppliersData.insertId
        profile.user_id = user_id
        suppliersProfile = await new SupplierModel().createSuppliersProfile( profile )
        address.address_type = "address";
        address.user_id = user_id;
        suppliersAddress = await new SupplierModel().createSuppliersAddress( address )

        return suppliersData;

    }catch(e:any){
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliers = async ( ) =>{
    let supplierData;
    supplierData = await new SupplierModel().fetchAllUsers(4)
    if (supplierData == null) throw new Error("details did not match");

    // Adding Baseurl to panurl from database
    for(let i=0;i< supplierData.length;i++) {
        delete supplierData[i].role_id;
        let data = await new SupplierModel().fetchSuppliersProfileById( supplierData[i].id )
        data[0].pan_img= config.baseUrl + "/" + data[0].pan_img;
        data[0].aadhaar_img= config.baseUrl + "/" + data[0].aadhaar_img;
        data[0].gstin_img = config.baseUrl + "/" + data[0].gstin_img;
        Object.assign( supplierData[i] , data[0] );
        let address = await new SupplierModel().fetchSuppliersAddressById( supplierData[i].id )
        Object.assign( supplierData[i] , address[0] )
    }
    return supplierData;
}
const isFileValid = (type:any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
      return false;
    }
    return true;
  };

const fetchSupplierById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchUserById( id, 4 );
        let suppliersProfile = await new SupplierModel().fetchSuppliersProfileById( id )
        let suppliersAddress = await new SupplierModel().fetchSuppliersAddressById( id )
        Object.assign( supplier[0], suppliersProfile[0], suppliersAddress[0]);
        if (supplier.length == 0) throw new Error("No supplier found");

        // Adding Baseurl to panurl from database
        supplier[0].pan_img= config.baseUrl + "/" + supplier[0].pan_img;
        supplier[0].aadhaar_img= config.baseUrl + "/" + supplier[0].aadhaar_img;
        supplier[0].gstin_img= config.baseUrl + "/" + supplier[0].gstin_img;

        return supplier[0];
    }
    catch (e){
        return e;
    }
}



const updateSuppliersDetails = async (data:any) => {
    try {
        let supplier = await new SupplierModel().fetchUserById( data.id, 4 )
        if( supplier.length == 0 ) throw new Error( "no supplier found")
        let supplierData = await new SupplierModel().updateUserDetails(data, data.id, 4);
        if ( !Object.keys(supplierData).length ) throw new Error("supplier updatation failed");
        return { message : "Supplier updated Successfully" };
    }
    catch (e){
        throw e; 
    }
}

const formidableUpdateDetails = async (req:any) =>{
    try{
        let updatedSupplierData, updatedSuppliersProfile,updatedSuppliersAddress, fields, files;
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                    resolve({fields: fields, files: files});})}));
        
        let id=Number(fields.id);
        let updatedSupplier : any = {};
        let profile : any = {};
        let address : any = {};

        // id field validation
        if(fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        
        // Fields validation
        if(fields.name !== undefined && fields.name !== null && fields.name !== "") 
        updatedSupplier.name=fields.name;
        if(fields.mobile !== undefined && fields.mobile !== null && fields.mobile !== "") 
        updatedSupplier.mobile=fields.mobile;
        if(fields.address !== undefined && fields.address !== null && fields.address !== "")
        address.address=fields.aaddress;
        if(fields.city !== undefined && fields.city !== null && fields.city !== "") 
        address.city=fields.city;
        if(fields.pincode !== undefined && fields.pincode !== null && fields.pincode !== "") 
        address.pincode=fields.pincode;
        if(fields.latitude !== undefined && fields.latitude !== null && fields.latitude !== "") 
        profile.latitude=fields.latitude;
        // { if(Number(fields.latitude))updatedSupplier.latitude=fields.latitude;else throw new Error("latitude not integer value")}
        if(fields.longitude !== undefined && fields.longitude !== null && fields.longitude !== "") 
        profile.longitude=fields.longitude;
       
        if(fields.aadhaar_no !== undefined && fields.aadhaar_no !== null && fields.aadhaar_no !== "") 
        profile.aadhaar_no=fields.aadhaar_no;
        if(fields.pan_no !== undefined && fields.pan_no !== null && fields.pan_no !== "") 
        profile.pan_no=fields.pan_no;
        if(fields.gstin_no !== undefined && fields.gstin_no !== null && fields.gstin_no !== "") 
        profile.gstin_no=fields.gstin_no;
 
        // Files validation
        let s3Images:any = [];
        if(files.aadhaar_img !== undefined && files.aadhaar_img !== null && files.aadhaar_img !== ""){
        if(isFileValid(files.aadhaar_img.mimetype))throw new Error("aadhaar_img should be jpg or png type");s3Images['aadhaar_img']=files.aadhaar_img;}
        if(files.pan_img !== undefined && files.pan_img !== null && files.pan_img !== ""){
        if(isFileValid(files.pan_img.mimetype))throw new Error("pan_img should be jpg or png type");s3Images['pan_img']=files.pan_img;}
        if(files.gstin_img !== undefined && files.gstin_img !== null && files.gstin_img !== ""){
        if(isFileValid(files.gstin_img.mimetype))throw new Error("gstin_img should be jpg or png type");s3Images['gstin_img']=files.gstin_img;}

        // Multiple files upload to s3Bucket
        if( Object.keys(s3Images).length ){ const s3Paths = await uploadFiles( s3Images )
            Object.assign(profile, s3Paths);}

        if( Object.keys(updatedSupplier).length ){ updatedSupplierData = await new SupplierModel().updateUserDetails(updatedSupplier,fields.id, 4)
            if (!updatedSupplierData) throw new Error("Supplier updation failed.");  }

        if( Object.keys(profile).length  ){updatedSuppliersProfile = await new SupplierModel().updateSuppliersProfileDetails(profile,fields.id)
            if (!updatedSuppliersProfile) throw new Error("Suppliers profile details updation failed."); }

        if( Object.keys(address).length ){ updatedSuppliersAddress = await new SupplierModel().updateSuppliersAddressDetails(address,fields.id)
            if (!updatedSuppliersAddress) throw new Error("Suppliers address details updation failed."); }
        return updatedSupplierData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

const loginSupplier = async ( data : any ) => {
    try{
        let supplier = await new SupplierModel().fetchUserByMobile( data.mobile, 4 )
        console.log( " service.supplier : ", supplier )
        if ( supplier.length === 0 ) throw new Error( "Invalid mobile number");
        if ( supplier[0].status !== 1 ) throw new Error( "Your account is not active");
        // const otp = Math.floor( 100000 + Math.random() * 900000 )
        const otp  = "123456";
        LOGGER.info( otp )
        data.otp = otp;
        data.user_id = supplier[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
        delete data.mobile;
        data.trials = 3;
        console.log( "Data before create otp------->", data)
        const otp_details = await new SupplierModel().createOtp(data)
        console.log( "create Otp result : " ,  otp_details );
        return { request_id : data.req_id };
    } catch ( e ) {
        return e;
    }
}

const verify_supplier_otp = async ( data : any ) => {
    try{
        LOGGER.info( 111, data )
        let otp_details = await new SupplierModel().getSupplierOtp( data )
        console.log( "otp details service : ", otp_details )
        if ( otp_details.length === 0 ) throw new Error( "Error in login" )
        if ( otp_details[0].trials <= 0 ) throw new Error( "No more trials" )
        if ( parseInt( data.otp ) !== otp_details[0].otp ){
            otp_details[0].trials = otp_details[0].trials - 1;
            await new SupplierModel().updateTrials( otp_details[0].req_id, otp_details[0].trials )
            throw new Error( "Incorrect OTP ")
        }
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let expire_time = moment(otp_details[0].expire_time).utc().format("YYYY-MM-DD HH:mm:ss").toString();
        if ( !(expire_time >= now) ) throw new Error( "OTP expired")
        otp_details[0].token = await Encryption.generateJwtToken({ id : otp_details[0].user_id })
        LOGGER.info("LOGIN SUCCESSFULL");
        return {token : otp_details[0].token, supplier_id : otp_details[0].user_id}
    }
    catch( error ){
        return error;
    }
}

export default {
    createSupplier,
    loginSupplier,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSuppliersDetails,
    formidableUpdateDetails,
    verify_supplier_otp
}
