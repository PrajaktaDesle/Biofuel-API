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
       
        // Address field validation
        if(fd.billing_address == undefined || fd.billing_address == null || fd.billing_address == "") throw new Error("billing_address is required");
        if(fd.source_address == undefined || fd.source_address == null || fd.source_address == "") throw new Error("source_address is required");
        if(fd.source_pincode == undefined || fd.source_pincode == null || fd.source_pincode == "") throw new Error("source_pincode is required");
        if(fd.source_city == undefined || fd.source_city == null || fd.source_city == "") throw new Error("source_city is required");
        if(fd.source_state == undefined || fd.source_state == null || fd.source_state == "") throw new Error("source_state is required");

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

        // Saving supplier details to the database
        let user = {"name":fd.name,"mobile":fd.contact_no,"email":fd.email,"role_id":3}
        suppliersData = await new SupplierModel().createUser( user )
        let user_id = suppliersData.insertId
        let profile = {"aadhaar_no":fd.aadhaar_no,"pan_no":fd.pan_no,"gstin":fd.gstin_no,"msme_no":fd.msme_no,"user_id":user_id}
        Object.assign( profile, s3Paths );
        await new SupplierModel().supplierRawMaterialMapping({"supplier_id":user_id,"raw_material_id":fd.raw_material})
        await new SupplierModel().supplierPackagingMapping({"supplier_id":user_id,"packaging":fd.packaging})
        suppliersProfile = await new SupplierModel().createSuppliersProfile( profile )
        let billing_address = {"address_type":"billing","address":fd.billing_address,"user_type":1,"user_id":user_id} 
        suppliersAddress = await new SupplierModel().createSuppliersAddress( billing_address )
        let source_address : any = {"address_type":"source","address":fd.source_address,"pincode":fd.source_pincode,"city_id":fd.source_city,"user_type":1,"user_id":user_id}
        if(fd.longitude == undefined || fd.longitude == null || fd.longitude == "") source_address.longitude = fd.longitude;
        if(fd.latitude == undefined || fd.latitude == null || fd.latitude == "") source_address.latitude = fd.latitude;
        suppliersAddress = await new SupplierModel().createSuppliersAddress( source_address )

        return suppliersData;

    }catch(e:any){
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliers = async ( ) =>{
    let suppliers;
    suppliers = await new SupplierModel().fetchAllUsers(3)
    if (suppliers == null) throw new Error("details did not match");
    console.log( "suppliers : ", suppliers )
    for(let i=0;i< suppliers.length;i++) {
        let suppliersProfile = await new SupplierModel().fetchSuppliersProfileAndSourceAddressById( suppliers[i].id )
        // Adding Baseurl to all images
        suppliersProfile[0].pan_url= config.baseUrl + "/" + suppliersProfile[0].pan_url;
        suppliersProfile[0].aadhaar_url= config.baseUrl + "/" + suppliersProfile[0].aadhaar_url;
        suppliersProfile[0].gstin_url = config.baseUrl + "/" + suppliersProfile[0].gstin_url;
        suppliersProfile[0].msme_url = config.baseUrl + "/" + suppliersProfile[0].msme_url;
        let billing_address = await new SupplierModel().fetchSuppliersBillingAddressById( suppliers[i].id )
        Object.assign( suppliers[i] , suppliersProfile[0], billing_address[0] )
    }
    return suppliers;
}
const isFileNotValid = (type:any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
      return false;
    }
    return true;
  };

const fetchSupplierById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchUserById( id, 3 );
        if (supplier.length == 0) throw new Error("Supplier not found");
        let suppliersProfile = await new SupplierModel().fetchSuppliersProfileAndSourceAddressById( id )
        suppliersProfile[0].city = {"label":suppliersProfile[0].city,"value":suppliersProfile[0].city_id}
        suppliersProfile[0].state = {"label":suppliersProfile[0].state,"value":suppliersProfile[0].state_id}
        if ( supplier[0].status == 0) supplier[0].status = {"label":"Pending","value":0};
        if ( supplier[0].status == 1) supplier[0].status = {"label":"Approved", "value": 1};
        if ( supplier[0].status == -1) supplier[0].status = {"label":"Rejected", "value": -1};
        if ( supplier[0].grade == 1) supplier[0].grade = {"label":"A", "value": 1};
        if ( supplier[0].grade == 2) supplier[0].grade = {"label":"B", "value": 2};
        if ( supplier[0].grade == 3) supplier[0].grade = {"label":"C", "value": 3};
        if ( supplier[0].grade == 4) supplier[0].grade = {"label":"D", "value": 4};
        let billing_address = await new SupplierModel().fetchSuppliersBillingAddressById( supplier[0].id )
        Object.assign( supplier[0], suppliersProfile[0], billing_address[0]);
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


const updateSupplierDetails = async (req:any) =>{
    try{
        let updatedSupplierData, updatedSuppliersProfile,updatedSuppliersAddress, fd, fl;
        //@ts-ignore
        ({fd, fl} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fd: any, fl: any) => {
                    resolve({fd: fd, fl: fl});})}));
        
        let id=Number(fd.id);
        let updatedSupplier : any = {}, profile : any = {}, billing_address : any = {}, source_address:any = {}, result:any = {}, city:any = {}, state:any = {};

        // id field validation
        if(fd.id == undefined || fd.id == null || fd.id == "") throw new Error("id is missing");

        // supplier exists or not
        let supplier = await new SupplierModel().fetchUserById( fd.id, 3 )
        if( supplier.length == 0 ) throw new Error( "Supplier not found" )

        // Fields validation
        if(fd.name !== undefined && fd.name !== null && fd.name !== "") 
        updatedSupplier.name=fd.name;
        if(fd.contact_no !== undefined && fd.contact_no !== null && fd.contact_no !== "") 
        updatedSupplier.mobile=fd.contact_no;
        if(fd.email !== undefined && fd.email !== null && fd.email !== "") 
        updatedSupplier.email=fd.email;
        if(fd.status !== undefined && fd.status !== null && fd.status !== "") 
        updatedSupplier.status=fd.status;
        if(fd.billing_address !== undefined && fd.billing_address !== null && fd.billing_address !== "")
        billing_address.address=fd.billing_address;
        if(fd.source_address !== undefined && fd.source_address !== null && fd.source_address !== "")
        source_address.address=fd.source_address;
        if(fd.source_city !== undefined && fd.source_city !== null && fd.source_city !== "") 
        source_address.city_id=fd.source_city;
        // if(fd.source_state !== undefined && fd.source_state !== null && fd.source_state !== "") 
        // source_address.state=fd.source_state;
        if(fd.source_pincode !== undefined && fd.source_pincode !== null && fd.source_pincode !== "") 
        source_address.pincode=fd.source_pincode;
        if(fd.latitude !== undefined && fd.latitude !== null && fd.latitude !== "") 
        source_address.latitude=fd.latitude;
        if(fd.longitude !== undefined && fd.longitude !== null && fd.longitude !== "") 
        source_address.longitude=fd.longitude;
       
        if(fd.aadhaar_no !== undefined && fd.aadhaar_no !== null && fd.aadhaar_no !== "") 
        profile.aadhaar_no=fd.aadhaar_no;
        if(fd.pan_no !== undefined && fd.pan_no !== null && fd.pan_no !== "") 
        profile.pan_no=fd.pan_no;
        if(fd.gstin_no !== undefined && fd.gstin_no !== null && fd.gstin_no !== "") 
        profile.gstin=fd.gstin_no;
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

        // Saving the data to the database
        if( Object.keys(updatedSupplier).length  ){await new SupplierModel().updateUserDetails(updatedSupplier,fd.id,3).then((data)=>{console.log("supplier details updated successfully")})}
        if( Object.keys(profile).length  ){ await new SupplierModel().updateSuppliersProfileDetails(profile,fd.id).then((data)=>{console.log("supplier's profile details updated successfully")})}
        if( Object.keys(billing_address).length ){ await new SupplierModel().updateSuppliersAddressDetails(billing_address,fd.id,"billing").then((data)=>{console.log("supplier's billing address details updated successfully")})}
        if( Object.keys(source_address).length ){ await new SupplierModel().updateSuppliersAddressDetails(source_address,fd.id,"source").then((data)=>{console.log("supplier's source address details updated successfully")})}
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
        const otp  = "123456";
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
    console.log( data )
    return data 
}




export default {
    createSupplier,
    loginSupplier,
    fetchAllSuppliers,
    fetchSupplierById,
    updateSupplierDetails,
    verify_supplier_otp,
    getHomePage
}