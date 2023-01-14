import { SupplierModel } from "../Models/Supplier/Supplier.model";
import { uploadFile, uploadFiles } from "../utilities/S3Bucket";
const { v4: uuidv4 } = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import { CustomerModel } from "../Models/Customer/Customer.model";
import dayjs from 'dayjs'

const createSupplier = async (req: any) => {
    try {
        let suppliersData, suppliersProfile, suppliersAddress, material, fd, fl;
        //@ts-ignore
        ({ fd, fl } = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({ fd: fields, fl: files });
            })
        }));
        console.log( " fd, fl : ", fd, fl)
        // Profile Fields validation
        if (fd.name == undefined || fd.name == null || fd.name == "") throw new Error("name is required");
        if (fd.contact_no == undefined || fd.contact_no == null || fd.contact_no == "") throw new Error("contact_no is required");
        if (fd.aadhaar_no == undefined || fd.aadhaar_no == null || fd.aadhaar_no == "") throw new Error("aadhaar_no is required");
        if (fd.pan_no == undefined || fd.pan_no == null || fd.pan_no == "") throw new Error("pan_no is required");
        if (fd.gstin_no == undefined || fd.gstin_no == null || fd.gstin_no == "") throw new Error("gstin_no is required");
        if (fd.msme_no == undefined || fd.msme_no == null || fd.msme_no == "") throw new Error("msme_no is required");
        if (fd.packaging == undefined || fd.packaging == null || fd.packaging == "") throw new Error("packaging is required");
        // if (fd.payment_term == undefined || fd.payment_term == null || fd.payment_term == "") throw new Error("payment_term is required");
        // if(fd.comment == undefined || fd.comment == null || fd.comment == "") throw new Error("comment is required");
        // if (fd.grade == undefined || fd.grade == null || fd.grade == "") throw new Error("grade is required");

        // Address field validation
        if (fd.billing_address == undefined || fd.billing_address == null || fd.billing_address == "") throw new Error("billing_address is required");
        if (fd.source_address == undefined || fd.source_address == null || fd.source_address == "") throw new Error("source_address is required");
        if (fd.source_pincode == undefined || fd.source_pincode == null || fd.source_pincode == "") throw new Error("source_pincode is required");
        if (fd.billing_pincode == undefined || fd.billing_pincode == null || fd.billing_pincode == "") throw new Error("billing_pincode is required");
        if (fd.source_city == undefined || fd.source_city == null || fd.source_city == "") throw new Error("source_city is required");
        if (fd.source_state == undefined || fd.source_state == null || fd.source_state == "") throw new Error("source_state is required");
        if (fd.billing_city == undefined || fd.billing_city == null || fd.billing_city == "") throw new Error("billing_city is required");
        if (fd.billing_state == undefined || fd.billing_state == null || fd.billing_state == "") throw new Error("billing_state is required");

        // Files validation
        let s3Images: any;
        if (fl.aadhaar_img !== undefined && fl.aadhaar_img !== null && fl.aadhaar_img !== "") {
            if (isFileNotValid(fl.aadhaar_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_img")
        }
        else { throw new Error("aadhaar_img is required") }

        if (fl.pan_img !== undefined && fl.pan_img !== null && fl.pan_img !== "") {
            if (isFileNotValid(fl.pan_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for pan_img")
        }
        else { throw new Error("pan_img is required") }

        if (fl.gstin_img !== undefined && fl.gstin_img !== null && fl.gstin_img !== "") {
            if (isFileNotValid(fl.gstin_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for gstin_img")
        }
        else { throw new Error("gstin_img is required") }

        if (fl.msme_img !== undefined && fl.msme_img !== null && fl.msme_img !== "") {
            if (isFileNotValid(fl.msme_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img")
        }
        else { throw new Error("msme_img is required") }

        // Multiple fl upload to s3Bucket
        s3Images = { "aadhaar_url": fl.aadhaar_img, "pan_url": fl.pan_img, "gstin_url": fl.gstin_img, "msme_url": fl.msme_img }
        const s3Paths = await uploadFiles(s3Images)

        // Saving supplier details to the database
        let user = { "name": fd.name, "mobile": fd.contact_no, "email": fd.email, "role_id": 3 }
        suppliersData = await new SupplierModel().createUser(user)
        let user_id = suppliersData.insertId
        let profile = { "aadhaar_no": fd.aadhaar_no, "pan_no": fd.pan_no, "gstin_no": fd.gstin_no, "msme_no": fd.msme_no, "user_id": user_id, "comment": fd.comment || null, "payment_term": fd.payment_term || null, "grade": fd.grade || null }
        Object.assign(profile, s3Paths);

        if (fd.raw_material == undefined || fd.raw_material == null || fd.raw_material == ""){ throw new Error("raw_material is required");}
        else{
            let raw_material_mapping=  JSON.parse(fd.raw_material) ;
            let arr = []
            if( raw_material_mapping.length ){
                for (let i = 0; i < raw_material_mapping.length; i ++) {
                    arr.push([user_id, raw_material_mapping[i], 1])
                }
            if( arr.length ) await new SupplierModel().supplierRawMaterialMappingMany(arr);
            } 
        }
        
        await new SupplierModel().supplierPackagingMapping({ "supplier_id": user_id, "packaging_id": fd.packaging })
        suppliersProfile = await new SupplierModel().createSuppliersProfile(profile)
        let billing_address = { "address_type": 1, "address": fd.billing_address, "pincode": fd.billing_pincode, "city_id": fd.billing_city, "user_type": 1, "user_id": user_id }
        suppliersAddress = await new SupplierModel().createSuppliersAddress(billing_address)
        let source_address: any = { "address_type": 2, "address": fd.source_address, "pincode": fd.source_pincode, "city_id": fd.source_city, "user_type": 1, "user_id": user_id }
        if (fd.longitude == undefined || fd.longitude == null || fd.longitude == "") source_address.longitude = fd.longitude;
        if (fd.latitude == undefined || fd.latitude == null || fd.latitude == "") source_address.latitude = fd.latitude;
        suppliersAddress = await new SupplierModel().createSuppliersAddress(source_address)

        return suppliersData;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliers = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let suppliers;
    let orderQuery: string;
    if (sort.key != "") {
        orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
    } else {
        orderQuery = " ORDER By CASE WHEN u.status=0 THEN 1 WHEN u.status=1 THEN 2 WHEN u.status=-1 THEN 3 END";
    }
    suppliers = await new SupplierModel().fetchAllSuppliers(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
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
const isFileNotValid = (type: any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png' || type == "application/pdf") {
        return false;
    }
    return true;
};

const fetchSupplierById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchSupplierById(id);
        if (supplier.length == 0) throw new Error("Supplier not found");
        let rm = { label: supplier[0].raw_material, value: supplier[0].raw_material_id };
        supplier[0].packaging = { label: supplier[0].packaging, value: supplier[0].packaging_id };
        supplier[0].raw_material = supplier[0].raw_material;
        supplier[0].billing_state = { label: supplier[0].billing_state, value: supplier[0].billing_state_id };
        supplier[0].billing_city = { label: supplier[0].billing_city, value: supplier[0].billing_city_id };
        supplier[0].source_state = { label: supplier[0].source_state, value: supplier[0].source_state_id };
        supplier[0].source_city = { label: supplier[0].source_city, value: supplier[0].source_city_id };
        if (supplier[0].status == 0) supplier[0].status = { "label": "Pending", "value": 0 };
        if (supplier[0].status == 1) supplier[0].status = { "label": "Approved", "value": 1 };
        if (supplier[0].status == -1) supplier[0].status = { "label": "Rejected", "value": -1 };
        if (supplier[0].grade == 1) supplier[0].grade = { "label": "A", "value": 1 };
        if (supplier[0].grade == 2) supplier[0].grade = { "label": "B", "value": 2 };
        if (supplier[0].grade == 3) supplier[0].grade = { "label": "C", "value": 3 };
        if (supplier[0].grade == 4) supplier[0].grade = { "label": "D", "value": 4 };

        // Adding Baseurl to panurl from database
        supplier[0].pan_img = config.baseUrl + "/" + supplier[0].pan_img;
        supplier[0].aadhaar_img = config.baseUrl + "/" + supplier[0].aadhaar_img;
        supplier[0].gstin_img = config.baseUrl + "/" + supplier[0].gstin_img;
        supplier[0].msme_img = config.baseUrl + "/" + supplier[0].msme_img;
        //console.log("suppp ->",supplier[0])
        return supplier[0];
    }
    catch (e) {
        return e;
    }
}


const updateSupplierDetails = async (req: any) => {
    try {
        let updatedSupplierData, updatedSuppliersProfile, updatedSuppliersAddress, fd, fl;
        //@ts-ignore
        ({ fd, fl } = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fd: any, fl: any) => {
                resolve({ fd: fd, fl: fl });
            })
        }));

        let id = Number(fd.id);

        let updatedSupplier: any = {}, profile: any = {}, billing_address: any = {}, source_address: any = {}, packaging_mapping: any = {}, raw_material_mapping: any = {}, result: any = {}, city: any = {}, state: any = {};

        // id field validation
        if (fd.id == undefined || fd.id == null || fd.id == "") throw new Error("id is missing");

        // supplier exists or not
        let supplier = await new SupplierModel().fetchUserById(fd.id, 3)
        if (supplier.length == 0) throw new Error("Supplier not found")

        // supplier contact deatails 
        if (fd.name !== undefined && fd.name !== null && fd.name !== "")
            updatedSupplier.name = fd.name;
        if (fd.contact_no !== undefined && fd.contact_no !== null && fd.contact_no !== "")
            updatedSupplier.mobile = fd.contact_no;
        if (fd.email !== undefined && fd.email !== null && fd.email !== "")
            updatedSupplier.email = fd.email;
        if (fd.status !== undefined && fd.status !== null && fd.status !== "")
            updatedSupplier.status = fd.status;

        // address details
        if (fd.billing_address !== undefined && fd.billing_address !== null && fd.billing_address !== "")
            billing_address.address = fd.billing_address;
        if (fd.source_address !== undefined && fd.source_address !== null && fd.source_address !== "")
            source_address.address = fd.source_address;
        if (fd.source_city !== undefined && fd.source_city !== null && fd.source_city !== "")
            source_address.city_id = fd.source_city;
        if (fd.billing_city !== undefined && fd.billing_city !== null && fd.billing_city !== "")
            billing_address.city_id = fd.billing_city;
        if (fd.source_pincode !== undefined && fd.source_pincode !== null && fd.source_pincode !== "")
            source_address.pincode = fd.source_pincode;
        if (fd.billing_pincode !== undefined && fd.billing_pincode !== null && fd.billing_pincode !== "")
            billing_address.pincode = fd.billing_pincode;
        if (fd.latitude !== undefined && fd.latitude !== null && fd.latitude !== "")
            source_address.latitude = fd.latitude;
        if (fd.longitude !== undefined && fd.longitude !== null && fd.longitude !== "")
            source_address.longitude = fd.longitude;

        // supplier profile details 
        if (fd.aadhaar_no !== undefined && fd.aadhaar_no !== null && fd.aadhaar_no !== "")
            profile.aadhaar_no = fd.aadhaar_no;
        if (fd.pan_no !== undefined && fd.pan_no !== null && fd.pan_no !== "")
            profile.pan_no = fd.pan_no;
        if (fd.gstin_no !== undefined && fd.gstin_no !== null && fd.gstin_no !== "")
            profile.gstin_no = fd.gstin_no;
        if (fd.msme_no !== undefined && fd.msme_no !== null && fd.msme_no !== "")
            profile.msme_no = fd.msme_no;
        if (fd.grade !== undefined && fd.grade !== null && fd.grade !== "")
            profile.grade = fd.grade;
        if (fd.payment_term !== undefined && fd.payment_term !== null && fd.payment_term !== "")
            profile.payment_term = fd.payment_term;
        if (fd.comment !== undefined && fd.comment !== null && fd.comment !== "")
            profile.comment = fd.comment;

        // supplier packagning and raw materials details 
        if (fd.packaging !== undefined && fd.packaging !== null && fd.packaging !== "")
            packaging_mapping.packaging_id = fd.packaging;
        
        // Files validation
        let s3Images: any = {};
        if (fl.aadhaar_img !== undefined && fl.aadhaar_img !== null && fl.aadhaar_img !== "") {
            if (isFileNotValid(fl.aadhaar_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for aadhaar_img"); else { s3Images.aadhaar_url = fl.aadhaar_img; }
        }
        if (fl.pan_img !== undefined && fl.pan_img !== null && fl.pan_img !== "") {
            if (isFileNotValid(fl.pan_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img! for pan_img"); else { s3Images.pan_url = fl.pan_img; }
        }
        if (fl.gstin_img !== undefined && fl.gstin_img !== null && fl.gstin_img !== "") {
            if (isFileNotValid(fl.gstin_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img! for gstin_img"); else { s3Images.gstin_url = fl.gstin_img; }
        }
        if (fl.msme_img !== undefined && fl.msme_img !== null && fl.msme_img !== "") {
            if (isFileNotValid(fl.msme_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for msme_img"); else { s3Images.msme_url = fl.msme_img }
        }

        // Multiple fl upload to s3Bucket
        if (Object.keys(s3Images).length) { const s3Paths = await uploadFiles(s3Images); Object.assign(profile, s3Paths); }

        // Saving the data to the database
        if (Object.keys(updatedSupplier).length) { await new SupplierModel().updateUserDetails(updatedSupplier, fd.id, 3).then((data) => { LOGGER.info("supplier details updated successfully") }) }
        if (Object.keys(profile).length) { await new SupplierModel().updateSuppliersProfileDetails(profile, fd.id).then((data) => { LOGGER.info("supplier's profile details updated successfully") }) }
        if (Object.keys(billing_address).length) { await new SupplierModel().updateSuppliersAddressDetails(billing_address, fd.id, 1).then((data) => { LOGGER.info("supplier's billing address details updated successfully") }) }
        if (Object.keys(source_address).length) { await new SupplierModel().updateSuppliersAddressDetails(source_address, fd.id, 2).then((data) => { LOGGER.info("supplier's source address details updated successfully") }) }
       
        if (fd.raw_material !== undefined && fd.raw_material !== null && fd.raw_material !== ""){
            raw_material_mapping = JSON.parse(fd.raw_material);
            let arr = []
            if (raw_material_mapping.length) {
                for (let i = 0; i < raw_material_mapping.length; i ++) {
                    arr.push([fd.id, raw_material_mapping[i], 1])
                }
                await new SupplierModel().updateSuppliersRawMaterialMapping({ 'status': 0 }, fd.id);
                if( arr.length )await new SupplierModel().supplierRawMaterialMappingMany(arr).then((data) => { LOGGER.info("supplier's raw materials details updated successfully") });
            }
           
        }
      
        if (Object.keys(packaging_mapping).length) { await new SupplierModel().updateSuppliersPackagingMapping(packaging_mapping, fd.id).then((data) => { LOGGER.info("supplier's packaging details updated successfully") }) }
        return { "message": "supplier updated successfully", "changedRows": 1 };
    } catch (e) {
        LOGGER.info("Exception ->", e);
        throw e;
    }
}

const loginSupplier = async (data: any) => {
    try {

        let supplier = await new SupplierModel().fetchUserByMobile(data.mobile, 3)
        LOGGER.info("service.supplier", supplier)
        if (supplier.length === 0) return { userExists: 0 , isApproved : 0};
        if (supplier[0].status !== 1) return { userExists: 1, isApproved : 0};
        // const otp = Math.floor( 100000 + Math.random() * 900000 )
        const otp = "1234";
        LOGGER.info("otp", otp)
        data.otp = otp;
        data.user_id = supplier[0].id;
        data.req_id = uuidv4();
        data.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
        delete data.mobile;
        data.trials = 3;
        LOGGER.info("Data before create otp", data)
        const otp_details = await new SupplierModel().createOtp(data)
        LOGGER.info("create Otp result", otp_details)
        return { request_id: data.req_id, userExists: 1, isApproved : 1  };;
    } catch (e) {
        return e;
    }
}

const verify_supplier_otp = async (data: any) => {
    try {
        LOGGER.info(111, data)
        let otp_details = await new SupplierModel().getSupplierOtp(data)
        if (otp_details.length === 0) throw new Error("Error in login")
        if (otp_details[0].trials <= 0) throw new Error("No more trials")
        if (parseInt(data.otp) !== otp_details[0].otp) {
            otp_details[0].trials = otp_details[0].trials - 1;
            await new SupplierModel().updateTrials(otp_details[0].req_id, otp_details[0].trials)
            throw new Error("Incorrect OTP ")
        }
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let expire_time = moment(otp_details[0].expire_time).utc().format("YYYY-MM-DD HH:mm:ss").toString();
        if (!(expire_time >= now)) throw new Error("OTP expired")
        otp_details[0].token = await Encryption.generateJwtToken({ id: otp_details[0].user_id })
        LOGGER.info("LOGIN SUCCESSFULL");
        return { token: otp_details[0].token, supplier_id: otp_details[0].user_id }
    }
    catch (error) {
        return error;
    }
}

const getHomePage = async () => {
    let data = await new SupplierModel().getHomePage()
    if (data.length == 0) {
        throw new Error("Home Page not found!")
    }
    LOGGER.info(data)
    return data
}
const fetchSuppliersMappedUnmapped = async (req:any) => {
    let result, state_id, customer_id
    try {
        state_id = req.query.state_id
        customer_id = req.query.customer_id
        // @ts-ignore
        result = await new SupplierModel().getMappedUnmappedSuppliers(customer_id, state_id)
        if (result.length == null) throw new Error(" supplier not found!")
        return {"data":result,"total":result.length}
    } catch (e) {
        return e
    }
}
// fetchAllSupplierPO
const fetchAllSupplierPO = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let suppliers;
    let orderQuery: string;
    if (sort.key != "") {
        orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
    } else {
        orderQuery = " ORDER By CASE WHEN spo.status=0 THEN 1 WHEN spo.status=1 THEN 2 WHEN spo.status=-1 THEN 3 END";
    }
    suppliers = await new SupplierModel().fetchAllSupplierPO(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
    console.log("suppliers : ", suppliers)
    return suppliers;
}

const fetchAllSupplierPOCount = async (query: string) => {
    try {
        let suppliers = await new SupplierModel().fetchAllSupplierPOCount(query);
        return suppliers.length;
    }
    catch (error: any) {
        return error
    }
}

const updateSupplierPO = async (data: any) => {
    try {
        let sales_order: any = {}, dt: any;
        let id = data.id;
        dt = await new SupplierModel().SupplierPOExistsOrNot(id);
        if (dt.length == 0) throw new Error("Supplier purchase order not found ")

        if (data.supplier !== undefined && data.supplier !== null && data.supplier !== "")
            sales_order.supplier_id = data.supplier;

        let estimateNo = ((await new SupplierModel().supplierPONoExistsOrNot(data.supplier_po_number))[0]) ? (await new SupplierModel().supplierPONoExistsOrNot(data.supplier_po_number))[0] : null;
        let estimateNoWithId = ((await new SupplierModel().supplierPOIdNoExistsOrNot(data.id,data.supplier_po_number))[0]) ? (await new SupplierModel().supplierPOIdNoExistsOrNot(data.id,data.supplier_po_number))[0] : null;
        console.log( " Id : ", data.id, " estimate_no : ", data.estimate_no)
        if (data.supplier_po_number !== undefined && data.supplier_po_number !== null && data.supplier_po_number !== ""){
            if(estimateNo && estimateNoWithId){
                if( estimateNoWithId.id === estimateNo.id){
                    sales_order.po_number = data.supplier_po_number;
                }
                else{
                    throw new Error( "Puchase Order Number already  exists! ")
                }
            } else if((!estimateNo && estimateNoWithId) || (estimateNo && !estimateNoWithId) ){
                console.log('ERROR TEST CONSOLE ',estimateNo,estimateNoWithId);
                throw new Error( "Puchase Order Number already exists!")
            } else{
                console.log('TEST CONSOLE ',estimateNo,estimateNoWithId);
                sales_order.po_number = data.supplier_po_number;
            }
        }
        // if (data.supplier_po_number !== undefined && data.supplier_po_number !== null && data.supplier_po_number !== "")
        //     sales_order.po_number = data.supplier_po_number;

        if (data.po_date !== undefined && data.po_date !== null && data.po_date !== "")
            sales_order.po_date = data.po_date;

        if (data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "")
            sales_order.delivery_date = data.delivery_date;

        if (data.customer_so_number !== undefined && data.customer_so_number !== null && data.customer_so_number !== "")
            sales_order.sales_order_id = data.customer_so_number;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            sales_order.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            sales_order.rate = data.rate;

        if (data.adjustment !== undefined)
            sales_order.adjustment_amount = data.adjustment;

        if (data.rate_type !== undefined && data.rate_type !== null && data.rate_type !== "")
            sales_order.rate_type = data.rate_type;

        if (data.po_type !== undefined && data.po_type !== null && data.po_type !== "")
            sales_order.po_type = data.po_type;

        if (data.status !== undefined && data.status !== null && data.status !== "") {
            sales_order.status = data.status;
            let log: any = { "supplier_po_id": id, "stage": data.status, "user_id": data.user_id }
            if (sales_order.status == -1) {
                // Estimate declined by customer
                LOGGER.info("Supplier Purchase is declined")
            }
            if (sales_order.status == 0) {
                // initial state of the estimate
                LOGGER.info("Supplier Purchase Order is in draft state")
            }
            if (sales_order.status == 1) {
                // need to integrate send an email functionaliey
                LOGGER.info("Suppler Purchase Order is  approved")
            }

            await new SupplierModel().createSupplierPOLogs(log)
        }


        let sales_order_data = await new SupplierModel().updateSupplierPO(sales_order, id)

        return sales_order_data;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchAllSuppliersList = async (query: string) => {
    try {
        let result = await new SupplierModel().fetchAllSuppliersList(query);
        if (result.length === 0) {
            throw new Error("Suppliers  not found!")

        }
        else {
            return result
        }
    }
    catch (err) {
        return err
    }
}

const createSupplierPO = async (data: any) => {
    try {
        let sales_order: any = {}, dt: any;

        console.log("request Data : ", data)
        if (data.supplier !== undefined && data.supplier !== null && data.supplier !== "")
            sales_order.supplier_id = data.supplier;

          
        if (data.supplier_po_number !== undefined && data.supplier_po_number !== null && data.supplier_po_number !== "")
        { 
            let estimate_no = data.supplier_po_number
            if( (await new SupplierModel().supplierPONoExistsOrNot(estimate_no)).length )throw new Error( "Puchase Order Number already  exists! ")
            sales_order.po_number = data.supplier_po_number;
        }

        if (data.customer_so_number !== undefined && data.customer_so_number !== null && data.customer_so_number !== "")
            sales_order.sales_order_id = data.customer_so_number;

        if (data.po_date !== undefined && data.po_date !== null && data.po_date !== "")
            sales_order.po_date = data.po_date;

        if (data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "")
            sales_order.delivery_date = data.delivery_date;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            sales_order.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            sales_order.rate = data.rate;

        if (data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
            sales_order.adjustment_amount = data.adjustment;

        if (data.rate_type !== undefined && data.rate_type !== null && data.rate_type !== "")
            sales_order.rate_type = data.rate_type;

        if (data.po_type !== undefined && data.po_type !== null && data.po_type !== "")
            sales_order.po_type = data.po_type;

        if (data.status !== undefined && data.status !== null && data.status !== "") sales_order.status = data.status;
        else { sales_order.status = 0 }
        var supplierPOData = await new SupplierModel().createSuppliersPO(sales_order)

        return supplierPOData
    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}
const createChallanService = async (fields: any) => {
    let data: any = {}
    try {
        if (fields.quantity !== undefined && fields.quantity !== null && fields.quantity !== "")
            data.quantity = fields.quantity
        if (fields.DeliveryDate !== undefined && fields.DeliveryDate !== null && fields.DeliveryDate !== "")
            data.delivery_date = fields.DeliveryDate
        if (fields.NotificationNo !== undefined && fields.NotificationNo !== null && fields.NotificationNo !== "")
            data.dispatch_id = fields.NotificationNo
        if (fields.VehicleNo !== undefined && fields.VehicleNo !== null && fields.VehicleNo !== "")
            data.vehicle_no = fields.VehicleNo
        if (fields.DriverNo !== undefined && fields.DriverNo !== null && fields.DriverNo !== "")
            data.driver_mobile_no = fields.DriverNo
        if (fields.TransportationRate !== undefined && fields.TransportationRate !== null && fields.TransportationRate !== "")
            data.transportation_rate = fields.TransportationRate
        if (fields.user_id !== undefined && fields.user_id !== null && fields.user_id !== "")
            data.user_id = fields.user_id
            data.status = 0
        let result = await new SupplierModel().createDeliveryChallenModel(data)
        if (result.length == 0) throw new Error("failed to generate delivery challan")
        return result
    } catch (e) {
        throw e
    }
}

const fetchAllDeliveryChallan = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let result;
    try {
        let orderQuery: string = "";
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        }
        // @ts-ignore
        result = await new SupplierModel().fetchAllDeliveryChallan(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        if (result == null) throw new Error("challan not found");
        return result;
    } catch (error: any) {
        throw error
    }
}

const fetchAllChallansCount = async (query: string) => {
    try {
        let challan = await new SupplierModel().fetchChallanCount(query);
        return challan.length;
    }
    catch (error: any) {
        return error
    }
}

const updateChallanServcie = async(req:any)=>{
    // @ts-ignore
    try{
        let fields,files, result;
        let challan:any = {};
        // @ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});})
        }));
        if(fields.challan_id == undefined || fields.challan_id == null || fields.challan_id == "") throw new Error("id is missing");
        result = await new SupplierModel().fetchchallanById(fields.challan_id)
        if (result.length == 0) throw new Error("challan id not found");
        if(fields.status !== undefined && fields.status !== null && fields.status !== "")
            challan.status = fields.status
        if(fields.EwayBillNo !== undefined && fields.EwayBillNo !== null && fields.EwayBillNo !== "")
            challan.eway_bill = fields.EwayBillNo
        let s3Images: any = {};
        if (files.EwayBill !== undefined && files.EwayBill !== null && files.EwayBill !== "") {
            if (isFileNotValid(files.EwayBill.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.ewaybill_url = files.EwayBill; }
        }
        if (files.Bilty !== undefined && files.Bilty !== null && files.Bilty !== "") {
            if (isFileNotValid(files.Bilty.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.bilty_url = files.Bilty; }
        }
        if (files.challan !== undefined && files.challan  !== null && files.challan !== "") {
            if (isFileNotValid(files.challan.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf format allowed!"); else { s3Images.delivery_challan_url = files.challan; }
        }
        if (files.invoice !== undefined && files.invoice !== null && files.invoice!== "") {
            if (isFileNotValid(files.invoice.mimetype)) throw new Error("Only .png, .jpg ,.jpeg, .pdf format allowed! "); else { s3Images.invoice_url = files.invoice; }
        }
        if (files.weight_slip !== undefined && files.weight_slip !== null && files.weight_slip !== "") {
            if (isFileNotValid(files.weight_slip.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.weight_slip_url = files.weight_slip }
        }
        // Multiple fl upload to s3Bucket
        if (Object.keys(s3Images).length) { const s3Paths = await uploadFiles(s3Images); Object.assign(challan, s3Paths); }

        if( Object.keys(challan).length) {
                let updatedData = await new SupplierModel().updateChallan(challan, fields.challan_id)
                return {message: "updated successfully", result:updatedData}
            }
                return {message: "updated successfully", "changedRows":0 }

    }catch(error){
        throw error
    }
}

const fetchSupplierPOById = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchAllSupplierPOById(id);
        if (supplier.length == 0) throw new Error("Supplier PO not found");
        supplier[0].customer_so_number = { label: supplier[0].customer_so_number, value: supplier[0].sales_order_id };
        supplier[0].supplier = { label: supplier[0].name, value: supplier[0].supplier_id };
        if (supplier[0].status == 0) supplier[0].status = { "label": "Draft", "value": 0 };
        if (supplier[0].status == 1) supplier[0].status = { "label": "Pending for Approval", "value": 1 };
        if (supplier[0].status == 2) supplier[0].status = { "label": "Approved", "value": 2 };
        if (supplier[0].status == 3) supplier[0].status = { "label": "Issued", "value": 3 };
        if (supplier[0].status == -1) supplier[0].status = { "label": "Rejected", "value": -1 };
        if (supplier[0].rate_type == 0) supplier[0].rate_type = { "label": "Factory", "value": 0 };
        if (supplier[0].rate_type == 1) supplier[0].rate_type = { "label": "Delivery", "value": 1 };
        if (supplier[0].po_type == 0) supplier[0].po_type = { "label": "New", "value": 0 };
        if (supplier[0].po_type == 1) supplier[0].po_type = { "label": "Secondary", "value": 1 };
        supplier[0].po_date = dayjs(supplier[0].po_date, 'YYYY-MM-DD').toDate()
        return supplier[0];
    }
    catch (e) {
        return e;
    }
}

const fetchSupplierPOBySupplierId = async (id: any) => {
    try {
        let supplier = await new SupplierModel().fetchAllSupplierPOBySupplierId(id);
        if (supplier.length == 0) throw new Error("Supplier PO not found");
        for (var i = 0; i < supplier.length; i++) {
            supplier[i].customer_so_number = { label: supplier[i].customer_so_number, value: supplier[i].sales_order_id };
            supplier[i].supplier = { label: supplier[i].supplier, value: supplier[i].supplier_id };
            if (supplier[i].status == 0) supplier[i].status = { "label": "Draft", "value": 0 };
            if (supplier[i].status == 1) supplier[i].status = { "label": "Pending For Approval", "value": 1 };
            if (supplier[i].status == 2) supplier[i].status = { "label": "Approved", "value": 2 };
            if (supplier[i].status == 3) supplier[i].status = { "label": "Issued", "value": 3 };
            if (supplier[i].status == -1) supplier[i].status = { "label": "Rejected", "value": -1 };
            if (supplier[i].rate_type == 0) supplier[i].rate_type = { "label": "Factory", "value": 0 };
            if (supplier[i].rate_type == 1) supplier[i].rate_type = { "label": "Delivery", "value": 1 };
            if (supplier[i].po_type == 0) supplier[i].po_type = { "label": "New", "value": 0 };
            if (supplier[i].po_type == 1) supplier[i].po_type = { "label": "Secondary", "value": 1 };
        }
        return supplier;
    }
    catch (e) {
        return e;
    }
}
const addsupplierPaymentService = async (fields: any) => {
    let payment, data: any;
    try {
        if (fields.approvedQuantity !== undefined && fields.approvedQuantity !== null && fields.approvedQuantity !== "")
            if (fields.delivery_challan_id !== undefined && fields.delivery_challan_id !== null && fields.delivery_challan_id !== "")
                data = { approved_quantity: fields.approvedQuantity, delivery_challan_id: fields.delivery_challan_id, status: 1 }
        payment = await new SupplierModel().addSupplierPayment(data)
        if (payment.length == 0) throw new Error("failed to add approved quantity")
        return payment
    } catch (error: any) {
        LOGGER.info("error", error)
        throw (error)
    }

}
const  fetchPaymentsDetails = async (pageIndex: number, pageSize: number, sort: any, query: string)=>{

    try{
        let orderQuery: string = "";
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        }
        let challan = await new SupplierModel().fetchAllPayments(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        if (challan == null ) throw new Error( "data not found" )
        for(var i = 0 ; i < challan.length ; i++){
            challan[i].ewaybill_url = config.baseUrl + "/" + challan[i].ewaybill_url;
            challan[i].delivery_challan_url = config.baseUrl + "/" + challan[i].delivery_challan_url;
            challan[i].bilty_url = config.baseUrl + "/" + challan[i].bilty_url;
            challan[i].invoice_url = config.baseUrl + "/" + challan[i].invoice_url;
            challan[i].weight_slip_url = config.baseUrl + "/" + challan[i].weight_slip_url;
            let pay = await new SupplierModel().fetchByDeliverychallanID(challan[i].delivery_challan_id)
            challan[i].approved_quantity = null
            challan[i].amount = null
            challan[i].invoice_no = null
            challan[i].utr_no = null
            challan[i].payment_date = null
            if( pay.length !== 0){
                challan[i].payment_id = pay[0].id
                challan[i].approved_quantity = pay[0].approved_quantity
                challan[i].amount = pay[0].amount
                challan[i].invoice_no = pay[0].invoice_no
                challan[i].utr_no = pay[0].utr_no
                challan[i].payment_date = pay[0].payment_date
            }
        }
        return challan
    }catch (error){
        throw error
    }
}
const fetchAllPaymentsCount = async(query:string)=>{
    try {
        let result = await new SupplierModel().fetchPaymentsCount(query);
        return result.length;
    }
    catch (error: any) {
        return error
    }
}
const updateSupplierPayment = async (fields: any) => {
    let supplier: any
    let data: any = {}
    try {
        if (fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        supplier = await new SupplierModel().fetchPaymentById(fields.id)
        if (supplier.length == 0) throw new Error(" supplier not found ")
        if (fields.payment_date !== undefined && fields.payment_date !== null && fields.payment_date !== "")
            data.payment_date = fields.payment_date;
        if (fields.invoice_no !== undefined && fields.invoice_no !== null && fields.invoice_no !== "")
            data.invoice_no = fields.invoice_no;
        if (fields.amount !== undefined && fields.amount !== null && fields.amount !== "")
            data.amount = fields.amount;
        if (fields.utr_no !== undefined && fields.utr_no !== null && fields.utr_no !== "")
            data.utr_no = fields.utr_no;
        if(fields.approved_quantity !== undefined && fields.approved_quantity !== null && fields.approved_quantity !== "")
            data.approved_quantity = fields.approved_quantity
        if (fields.status !== undefined && fields.status !== null && fields.status !== "")
            data.status = fields.status;
        if (Object.keys(data).length) {
            let updatedData = await new SupplierModel().updateSupplierPaymentDetails(data, fields.id)
            return updatedData
        }
        return { message: "updated sucssesfully ", "changedRows": 0 }
    } catch (error: any) {
        LOGGER.info("error", error)
        throw error
    }
}


const addSupplierSection = async (data: any) => {
    try {
        let model_result: any = [];
        for ( let i = 0 ; i < data.length ; i ++ ){
            let model_data: any = {};
            let id = 0;
            console.log("request Data : ", data[i])
            if (data[i].supplier_selection_id !== undefined && data[i].supplier_selection_id !== null && data[i].supplier_selection_id !== "")
             id = data[i].supplier_selection_id;

            if (data[i].sales_order_id !== undefined && data[i].sales_order_id !== null && data[i].sales_order_id !== "")
                model_data.sales_order_id = data[i].sales_order_id;
    
            if (data[i].supplier_id !== undefined && data[i].supplier_id !== null && data[i].supplier_id !== "")
                model_data.supplier_id = data[i].supplier_id;
    
            if (data[i].qt_factory_rate !== undefined && data[i].qt_factory_rate !== null && data[i].qt_factory_rate !== "")
                model_data.qt_factory_rate = data[i].qt_factory_rate;
    
            if (data[i].qt_transportation_rate !== undefined && data[i].qt_transportation_rate !== null && data[i].qt_transportation_rate !== "")
                model_data.qt_transportation_rate = data[i].qt_transportation_rate;
    
            if (data[i].qt_delivered_rate !== undefined && data[i].qt_delivered_rate !== null && data[i].qt_delivered_rate !== "")
                model_data.qt_delivered_rate = data[i].qt_delivered_rate;
            
            if (data[i].qt_quantity !== undefined && data[i].qt_quantity !== null && data[i].qt_quantity !== "")
                model_data.qt_quantity = data[i].qt_quantity;
    
            if (data[i].status !== undefined && data[i].status !== null && data[i].status !== "") model_data.status = data[i].status;
            else { model_data.status = 1 }
            
            if( id ){
                console.log( "model data : ", model_data )
                model_result.push( await new SupplierModel().updateSupplierSelection(model_data, id) )
            }
            else{
                model_result.push( await new SupplierModel().addSupplierSelection(model_data) )

            }
        }
        return model_result
    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}
const updateSupplierSelection = async (data: any) => {
    try {
        let model_data: any = {}, dt: any;
        let id = data.supplier_selection_id;
        dt = await new SupplierModel().SupplierSelectionExistsOrNot(id);
        if (dt.length == 0) throw new Error("Selected Supplier does not exists !")

        if (data.supplier_selection_id !== undefined && data.supplier_selection_id !== null && data.supplier_selection_id !== "")
             id = data.supplier_selection_id;

            if (data.qt_factory_rate !== undefined && data.qt_factory_rate !== null && data.qt_factory_rate !== "")
                model_data.qt_factory_rate = data.qt_factory_rate;
    
            if (data.qt_transportation_rate !== undefined && data.qt_transportation_rate !== null && data.qt_transportation_rate !== "")
                model_data.qt_transportation_rate = data.qt_transportation_rate;
    
            if (data.qt_delivered_rate !== undefined && data.qt_delivered_rate !== null && data.qt_delivered_rate !== "")
                model_data.qt_delivered_rate = data.qt_delivered_rate;
            
            if (data.qt_quantity !== undefined && data.qt_quantity !== null && data.qt_quantity !== "")
                model_data.qt_quantity = data.qt_quantity;
    
        if (data.status !== undefined && data.status !== null && data.status !== "") {
            model_data.status = data.status;
            let log: any = { "supplier_selection_id": id, "stage": data.status, "user_id": data.user_id || 123 }
            if (model_data.status == 0) {
                // Estimate declined by customer
                LOGGER.info("Selected Suppler is in the Draft")
            }
            if (model_data.status == 1) {
                // initial state of the estimate
                LOGGER.info("Selected Suppler is  Notified")
            }
            if (model_data.status == 2) {
                // need to integrate send an email functionaliey
                LOGGER.info("Selected Suppler  is  Interested")
            }
            if (model_data.status == 3) {
                // need to integrate send an email functionaliey
                LOGGER.info("Selected Suppler is Shortlisted")
            }
            await new SupplierModel().createSupplierSelectionLogs(log)
        }


        let model_result = await new SupplierModel().updateSupplierSelection(model_data, id)

        return model_result;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}
const fetchAllNotificationsBySupplierId = async(req:any)=>{
    let result,id:any;
    try{
        id = req.query.supplier_id
        result = await new SupplierModel().fetchAllNotificationsBySupplierId(id)
        if (result.length == 0 ) throw new Error( "notification  not found" )
        return result
    }catch(err:any){
        throw err
    }
}
const fetchAllPaymentsBySupplierId = async(req:any)=>{
    let result,id:any;
    try{
        id = req.query.supplier_id
        result = await new SupplierModel().getAllPaymentsBySupplier_id(id)
        if (result.length == 0 ) throw new Error( "payment details  not found for given supplier" )
        return result
    }catch(err:any){
        throw err
    }
}
const fetchPotentialOrderBySupplierId = async( id : any )=> {
    let result
    try{
    
        result = await new SupplierModel().fetchPotentialOrderBySupplierId(id)
        return result
    }catch(err:any){
        throw err
    }
}
const supplierPONoExistsOrNot = async (req: any) => {
    try {
        let sponumber = req.query.sponumber
        let suppliers = await new SupplierModel().supplierPONoExistsOrNot(sponumber)
        if (suppliers.length == 0){
            return false
        }
        else{
        return  true
        }
    } catch (error: any) {
        return error
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
    fetchSuppliersMappedUnmapped,
    fetchAllSupplierPO,
    fetchAllSupplierPOCount,
    updateSupplierPO,
    fetchAllSuppliersList,
    createSupplierPO,
    fetchSupplierPOById,
    createChallanService,
    fetchAllDeliveryChallan,
    fetchAllChallansCount,
    updateChallanServcie,
    fetchSupplierPOBySupplierId,
    addsupplierPaymentService,
    fetchPaymentsDetails,
    fetchAllPaymentsCount,
    updateSupplierPayment,
    addSupplierSection,
    updateSupplierSelection,
    fetchAllNotificationsBySupplierId,
    fetchAllPaymentsBySupplierId,
    supplierPONoExistsOrNot,
    fetchPotentialOrderBySupplierId
}