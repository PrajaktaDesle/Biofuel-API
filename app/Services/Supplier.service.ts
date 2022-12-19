import {SupplierModel} from "../Models/Supplier/Supplier.model";
import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
const {v4 : uuidv4} = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import fs from 'fs';
import {CustomerModel} from "../Models/Customer/Customer.model";

const createSupplier = async (req:any) =>{
    try{
        let suppliersData, suppliersProfile, suppliersAddress, material, fd, fl;
        //@ts-ignore
        ({fd, fl} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                    resolve({fd: fields, fl: files});})}));
        // Profile Fields validation
        if(fd.name == undefined || fd.name == null || fd.name == "") throw new Error("name is required");
        if(fd.contact_no == undefined || fd.contact_no == null || fd.contact_no == "") throw new Error("contact_no is required");
        if(fd.aadhaar_no == undefined || fd.aadhaar_no == null || fd.aadhaar_no == "") throw new Error("aadhaar_no is required");
        if(fd.pan_no == undefined || fd.pan_no == null || fd.pan_no == "") throw new Error("pan_no is required");
        if(fd.gstin_no == undefined || fd.gstin_no == null || fd.gstin_no == "") throw new Error("gstin_no is required");
        if(fd.msme_no == undefined || fd.msme_no == null || fd.msme_no == "") throw new Error("msme_no is required");
        if(fd.raw_material == undefined || fd.raw_material == null || fd.raw_material == "") throw new Error("raw_material is required");
        if(fd.packaging == undefined || fd.packaging == null || fd.packaging == "") throw new Error("packaging is required");
        if(fd.payment_term == undefined || fd.payment_term == null || fd.payment_term == "") throw new Error("payment_term is required");
        // if(fd.comment == undefined || fd.comment == null || fd.comment == "") throw new Error("comment is required");
        if(fd.grade == undefined || fd.grade == null || fd.grade == "") throw new Error("grade is required");
        
        // Address field validation
        if(fd.billing_address == undefined || fd.billing_address == null || fd.billing_address == "") throw new Error("billing_address is required");
        if(fd.source_address == undefined || fd.source_address == null || fd.source_address == "") throw new Error("source_address is required");
        if(fd.source_pincode == undefined || fd.source_pincode == null || fd.source_pincode == "") throw new Error("source_pincode is required");
        if(fd.billing_pincode == undefined || fd.billing_pincode == null || fd.billing_pincode == "") throw new Error("billing_pincode is required");
        if(fd.source_city == undefined || fd.source_city == null || fd.source_city == "") throw new Error("source_city is required");
        if(fd.source_state == undefined || fd.source_state == null || fd.source_state == "") throw new Error("source_state is required");
        if(fd.billing_city == undefined || fd.billing_city == null || fd.billing_city == "") throw new Error("billing_city is required");
        if(fd.billing_state == undefined || fd.billing_state == null || fd.billing_state == "") throw new Error("billing_state is required");

        // Files validation
        let s3Images:any;
        if(fl.aadhaar_img !== undefined && fl.aadhaar_img !== null && fl.aadhaar_img !== ""){
        if(isFileNotValid(fl.aadhaar_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_img")}
        else{throw new Error("aadhaar_img is required")}

        if(fl.pan_img !== undefined && fl.pan_img !== null && fl.pan_img !== ""){
        if(isFileNotValid(fl.pan_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for pan_img")}
        else{throw new Error("pan_img is required")}

        if(fl.gstin_img !== undefined && fl.gstin_img !== null && fl.gstin_img !== ""){
        if(isFileNotValid(fl.gstin_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for gstin_img")}
        else{throw new Error("gstin_img is required")}

        if(fl.msme_img !== undefined && fl.msme_img !== null && fl.msme_img !== ""){
        if(isFileNotValid(fl.msme_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img")}
        else{throw new Error("msme_img is required")}

        // Multiple fl upload to s3Bucket
        s3Images = {"aadhaar_url":fl.aadhaar_img,"pan_url":fl.pan_img,"gstin_url":fl.gstin_img,"msme_url":fl.msme_img}
        const s3Paths = await uploadFiles( s3Images )

        // Saving supplier details to the database
        let user = {"name":fd.name,"mobile":fd.contact_no,"email":fd.email,"role_id":3}
        suppliersData = await new SupplierModel().createUser( user )
        let user_id = suppliersData.insertId
        let profile = {"aadhaar_no":fd.aadhaar_no,"pan_no":fd.pan_no,"gstin_no":fd.gstin_no,"msme_no":fd.msme_no,"user_id":user_id, "comment":fd.comment || null, "payment_term": fd.payment_term, "grade": fd.grade}
        Object.assign( profile, s3Paths );
        let arr = []; 
        // fd.raw_material = fd.raw_material.replaceAll("\"\\[","[");
        for (let i = 1; i < fd.raw_material.length - 1; i+=2) {
           arr.push([user_id,fd.raw_material[i],1])
        }
        await new SupplierModel().supplierRawMaterialMappingMany(arr)
        await new SupplierModel().supplierPackagingMapping({"supplier_id":user_id,"packaging_id":fd.packaging})
        suppliersProfile = await new SupplierModel().createSuppliersProfile( profile )
        let billing_address = {"address_type":1,"address":fd.billing_address,"pincode":fd.billing_pincode,"city_id":fd.billing_city,"user_type":1,"user_id":user_id} 
        suppliersAddress = await new SupplierModel().createSuppliersAddress( billing_address )
        let source_address : any = {"address_type":2,"address":fd.source_address,"pincode":fd.source_pincode,"city_id":fd.source_city,"user_type":1,"user_id":user_id}
        if(fd.longitude == undefined || fd.longitude == null || fd.longitude == "") source_address.longitude = fd.longitude;
        if(fd.latitude == undefined || fd.latitude == null || fd.latitude == "") source_address.latitude = fd.latitude;
        suppliersAddress = await new SupplierModel().createSuppliersAddress( source_address )

        return suppliersData;

    }catch(e:any){
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliers = async (pageIndex: number, pageSize : number, sort : any, query : string ) =>{
    let suppliers;
    let orderQuery : string;
        if(sort.key != ""){
            orderQuery = " ORDER BY "+ sort.key + " "+ sort.order +" ";
        } else{
            orderQuery = " ORDER By CASE WHEN u.status=0 THEN 1 WHEN u.status=1 THEN 2 WHEN u.status=-1 THEN 3 END";
        }
    suppliers = await new SupplierModel().fetchAllSuppliers(pageSize, (pageIndex-1) * pageSize, orderQuery, query)
    if (suppliers == null) throw new Error("Suppliers not found");
    return suppliers;
}
const fetchAllSuppliersCount = async (query: string) => {
    try {
        let suppliers = await new SupplierModel().fetchAllSuppliersCount(query);
        return suppliers.length;
    }
    catch (error: any) {
        return error
    }
}
const isFileNotValid = (type:any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
      return false;
    }
    return true;
  };

const fetchSupplierById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchSupplierById( id );
        if (supplier.length == 0) throw new Error("Supplier not found");
        let rm = {label : supplier[0].raw_material , value : supplier[0].raw_material_id};
        supplier[0].packaging = {label : supplier[0].packaging , value : supplier[0].packaging_id};
        supplier[0].raw_material = supplier[0].raw_material;
        supplier[0].billing_state = {label : supplier[0].billing_state , value : supplier[0].billing_state_id};
        supplier[0].billing_city = {label : supplier[0].billing_city , value : supplier[0].billing_city_id};
        supplier[0].source_state = {label : supplier[0].source_state , value : supplier[0].source_state_id};
        supplier[0].source_city = {label : supplier[0].source_city , value : supplier[0].source_city_id};
        if ( supplier[0].status == 0) supplier[0].status = {"label":"Pending","value":0};
        if ( supplier[0].status == 1) supplier[0].status = {"label":"Approved", "value": 1};
        if ( supplier[0].status == -1) supplier[0].status = {"label":"Rejected", "value": -1};
        if ( supplier[0].grade == 1) supplier[0].grade = {"label":"A","value":1};
        if ( supplier[0].grade == 2) supplier[0].grade = {"label":"B","value":2};
        if ( supplier[0].grade == 3) supplier[0].grade = {"label":"C","value":3};
        if ( supplier[0].grade == 4) supplier[0].grade = {"label":"D","value":4};

        // Adding Baseurl to panurl from database
        supplier[0].pan_img= config.baseUrl + "/" + supplier[0].pan_img;
        supplier[0].aadhaar_img= config.baseUrl + "/" + supplier[0].aadhaar_img;
        supplier[0].gstin_img= config.baseUrl + "/" + supplier[0].gstin_img;
        supplier[0].msme_img= config.baseUrl + "/" + supplier[0].msme_img;
//console.log("suppp ->",supplier[0])
        return supplier[0];
    }
    catch (e){
        return e;
    }
}


const updateSupplierDetails = async (req:any) =>{
    try{
        let updatedSupplierData, updatedSuppliersProfile,updatedSuppliersAddress, fd, fl;
        //@ts-ignore
        ({fd, fl} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fd: any, fl: any) => {
                    resolve({fd: fd, fl: fl});})}));
        
        let id=Number(fd.id);

        let updatedSupplier : any = {}, profile : any = {}, billing_address : any = {}, source_address:any = {}, packaging_mapping:any = {}, raw_material_mapping:any = {}, result:any = {}, city:any = {}, state:any = {};

        // id field validation
        if(fd.id == undefined || fd.id == null || fd.id == "") throw new Error("id is missing");

        // supplier exists or not
        let supplier = await new SupplierModel().fetchUserById( fd.id, 3 )
        if( supplier.length == 0 ) throw new Error( "Supplier not found" )

        // supplier contact deatails 
        if(fd.name !== undefined && fd.name !== null && fd.name !== "") 
        updatedSupplier.name=fd.name;
        if(fd.contact_no !== undefined && fd.contact_no !== null && fd.contact_no !== "") 
        updatedSupplier.mobile=fd.contact_no;
        if(fd.email !== undefined && fd.email !== null && fd.email !== "") 
        updatedSupplier.email=fd.email;
        if(fd.status !== undefined && fd.status !== null && fd.status !== "") 
        updatedSupplier.status=fd.status;

        // address details
        if(fd.billing_address !== undefined && fd.billing_address !== null && fd.billing_address !== "")
        billing_address.address=fd.billing_address;
        if(fd.source_address !== undefined && fd.source_address !== null && fd.source_address !== "")
        source_address.address=fd.source_address;
        if(fd.source_city !== undefined && fd.source_city !== null && fd.source_city !== "") 
        source_address.city_id=fd.source_city;
        if(fd.billing_city !== undefined && fd.billing_city !== null && fd.billing_city !== "") 
        billing_address.city_id=fd.billing_city;
        if(fd.source_pincode !== undefined && fd.source_pincode !== null && fd.source_pincode !== "") 
        source_address.pincode=fd.source_pincode;
        if(fd.billing_pincode !== undefined && fd.billing_pincode !== null && fd.billing_pincode !== "") 
        billing_address.pincode=fd.billing_pincode;
        if(fd.latitude !== undefined && fd.latitude !== null && fd.latitude !== "") 
        source_address.latitude=fd.latitude;
        if(fd.longitude !== undefined && fd.longitude !== null && fd.longitude !== "") 
        source_address.longitude=fd.longitude;
       
        // supplier profile details 
        if(fd.aadhaar_no !== undefined && fd.aadhaar_no !== null && fd.aadhaar_no !== "") 
        profile.aadhaar_no=fd.aadhaar_no;
        if(fd.pan_no !== undefined && fd.pan_no !== null && fd.pan_no !== "") 
        profile.pan_no=fd.pan_no;
        if(fd.gstin_no !== undefined && fd.gstin_no !== null && fd.gstin_no !== "") 
        profile.gstin_no=fd.gstin_no;
        if(fd.msme_no !== undefined && fd.msme_no !== null && fd.msme_no !== "") 
        profile.msme_no=fd.msme_no;
        if(fd.grade !== undefined && fd.grade !== null && fd.grade !== "") 
        profile.grade=fd.grade;
        if(fd.payment_term !== undefined && fd.payment_term !== null && fd.payment_term !== "") 
        profile.payment_term=fd.payment_term;
        if(fd.comment !== undefined && fd.comment !== null && fd.comment !== "") 
        profile.comment=fd.comment;
 
        // supplier packagning and raw materials details 
        if(fd.packaging !== undefined && fd.packaging !== null && fd.packaging !== "") 
        packaging_mapping.packaging_id=fd.packaging;
        if(fd.raw_material !== undefined && fd.raw_material !== null && fd.raw_material !== "") 
        raw_material_mapping.raw_material_id=fd.raw_material;
        // Files validation
        let s3Images:any = {};
        if(fl.aadhaar_img !== undefined && fl.aadhaar_img !== null && fl.aadhaar_img !== ""){
        if(isFileNotValid(fl.aadhaar_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_img");else{s3Images.aadhaar_url=fl.aadhaar_img;}}
        if(fl.pan_img !== undefined && fl.pan_img !== null && fl.pan_img !== ""){
        if(isFileNotValid(fl.pan_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img! for pan_img");else{s3Images.pan_url=fl.pan_img;}}
        if(fl.gstin_img !== undefined && fl.gstin_img !== null && fl.gstin_img !== ""){
        if(isFileNotValid(fl.gstin_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img! for gstin_img");else{s3Images.gstin_url=fl.gstin_img;}}
        if(fl.msme_img !== undefined && fl.msme_img !== null && fl.msme_img !== ""){
        if(isFileNotValid(fl.msme_img.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img");else{s3Images.msme_url=fl.msme_img}}

        // Multiple fl upload to s3Bucket
        if( Object.keys(s3Images).length ){ const s3Paths = await uploadFiles( s3Images ); Object.assign(profile, s3Paths); }
        
        // Saving the data to the database
        if( Object.keys(updatedSupplier).length  ){await new SupplierModel().updateUserDetails(updatedSupplier,fd.id,3).then((data)=>{LOGGER.info("supplier details updated successfully")})}
        if( Object.keys(profile).length  ){ await new SupplierModel().updateSuppliersProfileDetails(profile,fd.id).then((data)=>{LOGGER.info("supplier's profile details updated successfully")})}
        if( Object.keys(billing_address).length ){ await new SupplierModel().updateSuppliersAddressDetails(billing_address,fd.id,1).then((data)=>{LOGGER.info("supplier's billing address details updated successfully")})}
        if( Object.keys(source_address).length ){ await new SupplierModel().updateSuppliersAddressDetails(source_address,fd.id,2).then((data)=>{LOGGER.info("supplier's source address details updated successfully")})}
        if( Object.keys(raw_material_mapping).length ){
        let arr = []; 
        for (let i = 1; i < fd.raw_material.length - 1; i+=2) {
           arr.push([fd.id,fd.raw_material[i],1])
        }
        await new SupplierModel().updateSuppliersRawMaterialMapping({'status':0},fd.id);
        await new SupplierModel().supplierRawMaterialMappingMany(arr).then((data)=>{LOGGER.info("supplier's raw materials details updated successfully")})}
        if( Object.keys(packaging_mapping).length ){ await new SupplierModel().updateSuppliersPackagingMapping(packaging_mapping,fd.id).then((data)=>{LOGGER.info("supplier's packaging details updated successfully")})}
        return {"message" : "supplier updated successfully","changedRows":1};
    }catch(e){
        LOGGER.info("Exception ->", e);
        throw e;
    }
}

const loginSupplier = async ( data : any ) => {
    try{
        
        let supplier = await new SupplierModel().fetchUserByMobile( data.mobile, 3 )
        LOGGER.info( "service.supplier", supplier )
        if ( supplier.length === 0 ) throw new Error( "User does not exist");
        if ( supplier[0].status !== 1 ) throw new Error( "Your account is not active");
        // const otp = Math.floor( 100000 + Math.random() * 900000 )
        const otp  = "1234";
        LOGGER.info("otp", otp )
        data.otp = otp;
        data.user_id = supplier[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
        delete data.mobile;
        data.trials = 3;
        LOGGER.info( "Data before create otp", data)
        const otp_details = await new SupplierModel().createOtp(data)
        LOGGER.info( "create Otp result", otp_details )
        return { request_id : data.req_id };
    } catch ( e ) {
        return e;
    }
}

const verify_supplier_otp = async ( data : any ) => {
    try{
        LOGGER.info( 111, data )
        let otp_details = await new SupplierModel().getSupplierOtp( data )
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

const getHomePage = async ( ) =>{
    let data = await new SupplierModel().getHomePage()
    if (data.length == 0) {
            throw new Error("Home Page not found!")
        }
    LOGGER.info( data )
    return data 
}
const fetchSuppliersByState = async (req:any) => {
     let result, state
      try {
        state = req.query.state
        // @ts-ignore
        result = await new SupplierModel().getSuppliersByState(state)
        if (result.length == 0) throw new Error(" supplier not found!")
        return result;
    } catch (e) {
        return e
    }
}



export default {
    createSupplier,
    loginSupplier,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSupplierDetails,
    verify_supplier_otp,
    getHomePage,
    fetchAllSuppliersCount,
    fetchSuppliersByState
}