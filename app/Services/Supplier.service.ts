import {SupplierModel} from "../Models/Supplier/Supplier.model";
import {uploadFile, uploadFiles}  from "../utilities/S3Bucket";
const {v4 : uuidv4} = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import moment from 'moment';
import Encryption from "../utilities/Encryption";

const createSupplier = async (req:any) =>{
    try{
        let suppliersData, suppliersProfile, suppliersAddress, fd, fl;
        //@ts-ignore
        ({fd, fl} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                    resolve({fd: fields, fl: files});})}));
        
        // Profile Fields validation
        if(fd.name == undefined || fd.name == null || fd.name == "") throw new Error("name is required");
        if(fd.mobile == undefined || fd.mobile == null || fd.mobile == "") throw new Error("mobile is required");
        if(fd.aadhaar_no == undefined || fd.aadhaar_no == null || fd.aadhaar_no == "") throw new Error("aadhaar_no is required");
        if(fd.pan_no == undefined || fd.pan_no == null || fd.pan_no == "") throw new Error("pan_no is required");
        if(fd.gstin_no == undefined || fd.gstin_no == null || fd.gstin_no == "") throw new Error("gstin_no is required");
        if(fd.msme_no == undefined || fd.msme_no == null || fd.msme_no == "") throw new Error("msme_no is required");
       
        // Address field validation
        if(fd.billing_address == undefined || fd.billing_address == null || fd.billing_address == "") throw new Error("billing_address is required");
        if(fd.source_address == undefined || fd.source_address == null || fd.source_address == "") throw new Error("source_address is required");
        if(fd.pincode == undefined || fd.pincode == null || fd.pincode == "") throw new Error("pincode is required");
        if(fd.city == undefined || fd.city == null || fd.city == "") throw new Error("city is required");
        if(fd.longitude == undefined || fd.longitude == null || fd.longitude == "") throw new Error("longitude is required");
        if(fd.latitude == undefined || fd.latitude == null || fd.latitude == "") throw new Error("latitude is required");
        if(fd.source_address == undefined || fd.source_address == null || fd.source_address == "") throw new Error("source_address is required");

        // Files validation
        let s3Images:any;
        if(fl.aadhaar_url !== undefined && fl.aadhaar_url !== null && fl.aadhaar_url !== ""){
        if(isFileNotValid(fl.aadhaar_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_url")}
        else{throw new Error("aadhaar_url is required")}

        if(fl.pan_url !== undefined && fl.pan_url !== null && fl.pan_url !== ""){
        if(isFileNotValid(fl.pan_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for pan_url")}
        else{throw new Error("pan_url is required")}

        if(fl.gstin_url !== undefined && fl.gstin_url !== null && fl.gstin_url !== ""){
        if(isFileNotValid(fl.gstin_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for gstin_url")}
        else{throw new Error("gstin_url is required")}

        if(fl.msme_url !== undefined && fl.msme_url !== null && fl.msme_url !== ""){
        if(isFileNotValid(fl.msme_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_url")}
        else{throw new Error("msme_url is required")}

        // Multiple fl upload to s3Bucket
        s3Images = {"aadhaar_url":fl.aadhaar_url,"pan_url":fl.pan_url,"gstin_url":fl.gstin_url,"msme_url":fl.msme_url}
        const s3Paths = await uploadFiles( s3Images )

        let user = {"name":fd.name,"mobile":fd.mobile,"email":fd.email,"role_id":3}
        suppliersData = await new SupplierModel().createUser( user )
        let user_id = suppliersData.insertId
        let profile = {"aadhaar_no":fd.aadhaar_no,"pan_no":fd.pan_no,"gstin_no":fd.gstin_no,"msme_no":fd.msme_no,"user_id":user_id}
        Object.assign( profile, s3Paths );
        suppliersProfile = await new SupplierModel().createSuppliersProfile( profile )
        let addressB = {"address_type":"billing","address":fd.billing_address,"pincode":fd.pincode,"city":fd.city,"longitude":fd.longitude,"latitude":fd.latitude,"user_type":1,"user_id":user_id} 
        suppliersAddress = await new SupplierModel().createSuppliersAddress( addressB )
        let addressS = {"address_type":"source","address":fd.source_address,"user_type":1,"user_id":user_id}
        suppliersAddress = await new SupplierModel().createSuppliersAddress( addressS )

        return suppliersData;

    }catch(e:any){
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliers = async ( ) =>{
    let supplierData;
    supplierData = await new SupplierModel().fetchAllUsers(3)
    if (supplierData == null) throw new Error("details did not match");

    // Adding Baseurl to panurl from database
    for(let i=0;i< supplierData.length;i++) {
        let profile = await new SupplierModel().fetchSuppliersProfileById( supplierData[i].id )
        profile[0].pan_url= config.baseUrl + "/" + profile[0].pan_url;
        profile[0].aadhaar_url= config.baseUrl + "/" + profile[0].aadhaar_url;
        profile[0].gstin_url = config.baseUrl + "/" + profile[0].gstin_url;
        profile[0].msme_url = config.baseUrl + "/" + profile[0].msme_url;
        // Object.assign( supplierData[i] , [0] );
        let addressB = await new SupplierModel().fetchSuppliersBillingAddressById( supplierData[i].id )
        let addressS = await new SupplierModel().fetchSuppliersSourceAddressById( supplierData[i].id )
        Object.assign( supplierData[i] , profile[0], addressB[0], addressS[0] )
    }
    return supplierData;
}
const isFileNotValid = (type:any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
      return false;
    }
    return true;
  };

const fetchSupplierById = async (id: any) => {
    try {
        let SupplierObj = new SupplierModel()
        let supplier = await SupplierObj.fetchUserById( id, 3 );
        if (supplier.length == 0) throw new Error("Supplier not found");
        let suppliersProfile = await SupplierObj.fetchSuppliersProfileById( id )
        let suppliersBAddress = await SupplierObj.fetchSuppliersBillingAddressById( id )
        let suppliersSAddress = await SupplierObj.fetchSuppliersSourceAddressById( id )
        console.log( suppliersSAddress )
        Object.assign( supplier[0], suppliersProfile[0], suppliersBAddress[0], suppliersSAddress[0]);

        // Adding Baseurl to panurl from database
        supplier[0].pan_url= config.baseUrl + "/" + supplier[0].pan_url;
        supplier[0].aadhaar_url= config.baseUrl + "/" + supplier[0].aadhaar_url;
        supplier[0].gstin_url= config.baseUrl + "/" + supplier[0].gstin_url;
        supplier[0].msme_url= config.baseUrl + "/" + supplier[0].msme_url;

        return supplier[0];
    }
    catch (e){
        return e;
    }
}



const updateSuppliersDetails = async (data:any) => {
    try {
        let SupplierObj = new SupplierModel()
        let supplier = await SupplierObj.fetchUserById( data.id, 3 )
        if( supplier.length == 0 ) throw new Error( "no supplier found")
        let supplierData = await SupplierObj.updateUserDetails(data, 1, 3);
        LOGGER.info( "supplier details", supplierData )
        console.log( supplierData )
        return {"changedRows":supplierData.changedRows};
    }
    catch (e){
        throw e; 
    }
}

const formidableUpdateDetails = async (req:any) =>{
    try{
        let updatedSupplierData, updatedSuppliersProfile,updatedSuppliersAddress, fd, fl;
        //@ts-ignore
        ({fd, fl} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fd: any, fl: any) => {
                    resolve({fd: fd, fl: fl});})}));
        
        let id=Number(fd.id);
        let updatedSupplier : any = {}, profile : any = {}, addressB : any = {}, addressS:any = {}, result:any = {};
        let Obj = new SupplierModel();

        // id field validation
        if(fd.id == undefined || fd.id == null || fd.id == "") throw new Error("id is missing");

        // supplier exists or not
        let supplier = await Obj.fetchUserById( fd.id, 3 )
        if( supplier.length == 0 ) throw new Error( "Supplier not found" )

        // Fields validation
        if(fd.name !== undefined && fd.name !== null && fd.name !== "") 
        updatedSupplier.name=fd.name;
        if(fd.mobile !== undefined && fd.mobile !== null && fd.mobile !== "") 
        updatedSupplier.mobile=fd.mobile;
        if(fd.email !== undefined && fd.email !== null && fd.email !== "") 
        updatedSupplier.email=fd.email;
        if(fd.billing_address !== undefined && fd.billing_address !== null && fd.billing_address !== "")
        addressB.address=fd.billing_address;
        if(fd.source_address !== undefined && fd.source_address !== null && fd.source_address !== "")
        addressS.address=fd.source_address;
        if(fd.city !== undefined && fd.city !== null && fd.city !== "") 
        addressB.city=fd.city;
        if(fd.pincode !== undefined && fd.pincode !== null && fd.pincode !== "") 
        addressB.pincode=fd.pincode;
        if(fd.latitude !== undefined && fd.latitude !== null && fd.latitude !== "") 
        addressB.latitude=fd.latitude;
        if(fd.longitude !== undefined && fd.longitude !== null && fd.longitude !== "") 
        addressB.longitude=fd.longitude;
       
        if(fd.aadhaar_no !== undefined && fd.aadhaar_no !== null && fd.aadhaar_no !== "") 
        profile.aadhaar_no=fd.aadhaar_no;
        if(fd.pan_no !== undefined && fd.pan_no !== null && fd.pan_no !== "") 
        profile.pan_no=fd.pan_no;
        if(fd.gstin_no !== undefined && fd.gstin_no !== null && fd.gstin_no !== "") 
        profile.gstin_no=fd.gstin_no;
        if(fd.msme_no !== undefined && fd.msme_no !== null && fd.msme_no !== "") 
        profile.msme_no=fd.msme_no;
 
        // Files validation
        let s3Images:any = {};
        if(fl.aadhaar_url !== undefined && fl.aadhaar_url !== null && fl.aadhaar_url !== ""){
        if(isFileNotValid(fl.aadhaar_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_url");else{s3Images.aadhaar_url=fl.aadhaar_url;}}
        if(fl.pan_url !== undefined && fl.pan_url !== null && fl.pan_url !== ""){
        if(isFileNotValid(fl.pan_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_url! for pan_url");else{s3Images.pan_url=fl.pan_url;}}
        if(fl.gstin_url !== undefined && fl.gstin_url !== null && fl.gstin_url !== ""){
        if(isFileNotValid(fl.gstin_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_url! for gstin_url");else{s3Images.gstin_url=fl.gstin_url;}}
        if(fl.msme_url !== undefined && fl.msme_url !== null && fl.msme_url !== ""){
        if(isFileNotValid(fl.msme_url.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_url");else{s3Images.msme_url=fl.msme_url}}

        // Multiple fl upload to s3Bucket
        if( Object.keys(s3Images).length ){ const s3Paths = await uploadFiles( s3Images ); Object.assign(profile, s3Paths); }
        console.log( "profile : ", profile )
        if( Object.keys(updatedSupplier).length  ){ Obj.updateUserDetails(updatedSupplier,fd.id,3).then((data)=>{console.log("supplier details updated successfully")})}
        if( Object.keys(profile).length  ){ Obj.updateSuppliersProfileDetails(profile,fd.id).then((data)=>{console.log("supplier's profile details updated successfully")})}
        if( Object.keys(addressB).length ){ Obj.updateSuppliersAddressDetails(addressB,fd.id,"billing").then((data)=>{console.log("supplier's billing address details updated successfully")})}
        if( Object.keys(addressS).length ){ Obj.updateSuppliersAddressDetails(addressS,fd.id,"source").then((data)=>{console.log("supplier's source address details updated successfully")})}
        return {"message" : "supplier updated successfully","changedRows":1};
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

const loginSupplier = async ( data : any ) => {
    try{
        let SupplierObj = new SupplierModel()
        let supplier = await SupplierObj.fetchUserByMobile( data.mobile, 3 )
        LOGGER.info( "service.supplier", supplier )
        if ( supplier.length === 0 ) throw new Error( "User does not exist");
        if ( supplier[0].status !== 1 ) throw new Error( "Your account is not active");
        // const otp = Math.floor( 100000 + Math.random() * 900000 )
        const otp  = "123456";
        LOGGER.info("otp", otp )
        data.otp = otp;
        data.user_id = supplier[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
        delete data.mobile;
        data.trials = 3;
        LOGGER.info( "Data before create otp", data)
        const otp_details = await SupplierObj.createOtp(data)
        LOGGER.info( "create Otp result", otp_details )
        return { request_id : data.req_id };
    } catch ( e ) {
        return e;
    }
}

const verify_supplier_otp = async ( data : any ) => {
    try{
        LOGGER.info( 111, data )
        let SupplierObj = new SupplierModel()
        let otp_details = await SupplierObj.getSupplierOtp( data )
        if ( otp_details.length === 0 ) throw new Error( "Error in login" )
        if ( otp_details[0].trials <= 0 ) throw new Error( "No more trials" )
        if ( parseInt( data.otp ) !== otp_details[0].otp ){
            otp_details[0].trials = otp_details[0].trials - 1;
            await SupplierObj.updateTrials( otp_details[0].req_id, otp_details[0].trials )
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
