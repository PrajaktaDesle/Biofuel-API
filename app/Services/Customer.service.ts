import {uploadFile, uploadFiles} from "../utilities/S3Bucket";
import LOGGER from "../config/LOGGER";
import formidable from "formidable";

let config = require("../config");
import moment from 'moment';
import * as fs from "fs";
import {CustomerModel} from "../Models/Customer/Customer.model";
import {AddressModel} from "../Models/Address/Address.model"
import customerController from "../Controllers/Customer.controller";

const _ = require("lodash");
import dayjs from 'dayjs'

const createCustomer = async (req: any) => {
    try {
        let CustomerData, fields, files;
        let customer: any = {}, shippingAddress: any = {address_type: 0, user_type: 0},
            billingAddress: any = {address_type: 1, user_type: 0};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        // customer details
        if (fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        customer.name = fields.name;
        if (fields.contactNo == undefined || fields.contactNo == null || fields.contactNo == "") throw new Error("mobile is required");
        customer.mobile = fields.contactNo;
        if (fields.email == undefined || fields.email == null || fields.address == "") throw new Error("email is required");
        customer.email = fields.email;
        if (fields.gstinNo == undefined || fields.gstinNo == null || fields.gstinNo == "") throw new Error("gst_no is required");
        customer.gstin = fields.gstinNo;
        if (fields.paymentTerm == undefined || fields.paymentTerm == null || fields.paymentTerm == "") throw new Error("payment_term is required");
        customer.payment_term = Number(fields.paymentTerm);
        // customer Shipping address
        if (fields.shippingState == undefined || fields.shippingState == null || fields.shippingState == "") throw new Error("Shipping State is required");
        //shippingAddress.state = fields.shippingState;
        if (fields.shippingCity == undefined || fields.shippingCity == null || fields.shippingCity == "") throw new Error("Shipping City is required");
        shippingAddress.city_id = fields.shippingCity;
        if (fields.shippingAddress == undefined || fields.shippingAddress == null || fields.shippingAddress == "") throw new Error("Shipping Address is required");
        shippingAddress.address = fields.shippingAddress;
        if (fields.shippingPincode == undefined || fields.shippingPincode == null || fields.shippingPincode == "") throw new Error("Shipping pincode is required");
        shippingAddress.pincode = fields.shippingPincode;
        // customer Billing address
        if (fields.billingState == undefined || fields.billingState == null || fields.billingState == "") throw new Error("Billing State is required");
        //billingAddress.state = fields.billingState;
        if (fields.billingCity == undefined || fields.billingCity == null || fields.billingCity == "") throw new Error("Billing City is required");
        billingAddress.city_id = fields.billingCity;
        if (fields.billingAddress == undefined || fields.billingAddress == null || fields.billingAddress == "") throw new Error("Billing Address is required");
        billingAddress.address = fields.billingAddress;
        if (fields.billingPincode == undefined || fields.billingPincode == null || fields.billingPincode == "") throw new Error("Billing pincode is required");
        billingAddress.pincode = fields.billingPincode;
        /*
        if(fields.latitude == undefined || fields.latitude == null || fields.latitude == "")
        if(fields.longitude == undefined || fields.longitude == null || fields.longitude == "")*/
        // file validation
        var gstin_url: any;
        if (files.gstin_img !== undefined && files.gstin_img !== null && files.gstin_img !== "") {
            if (fileNotValid(files.gstin_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image");
            gstin_url = files.gstin_img
        } else {
            throw new Error(" gst_url is required");
        }
        let name: string = "images/gstin_url/" + moment().unix() + "." + gstin_url.originalFilename.split(".").pop()
        const result = await uploadFile(gstin_url, name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        customer.gstin_url = result.key;
        CustomerData = await new CustomerModel().createCustomer(customer)
        if (!CustomerData) throw Error("failed to create customer")
        // customer billing address
        billingAddress.user_id = CustomerData.insertId;
        let customerBillingaddress = await new AddressModel().createAddress(billingAddress);
        // customer shipping address
        shippingAddress.user_id = CustomerData.insertId;
        let customerShippingaddress = await new AddressModel().createAddress(shippingAddress);
        return {message: "added successfully ", InsertId: CustomerData.insertId};
    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fileNotValid = (type: any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
        return false;
    }
    return true;
};

const updateCustomerdetails = async (req: any) => {
    try {
        let customer_details, fields, files;
        let customer: any = {}, shippingAddress: any = {}, billingAddress: any = {};
        //@ts-ignore
        ({fields, files} = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});
            })
        }));
        if (fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");
        customer_details = await new CustomerModel().fetchCustomerById(fields.id)
        if (customer_details.length == 0) throw new Error("id not found!")
        //  customer details validations
        if (fields.status !== undefined && fields.status !== null && fields.status !== "") customer.status = fields.status
        if (fields.name !== undefined && fields.name !== null && fields.name !== "") customer.name = fields.name;
        if (fields.contactNo !== undefined && fields.contactNo !== null && fields.contactNo !== "") customer.mobile = fields.contactNo;
        if (fields.email !== undefined && fields.email !== null && fields.address !== "") customer.email = fields.email;
        if (fields.gstinNo !== undefined && fields.gstinNo !== null && fields.gstinNo !== "") customer.gstin = fields.gstinNo;
        if (fields.paymentTerm !== undefined && fields.paymentTerm !== null && fields.paymentTerm !== "") customer.payment_term = fields.paymentTerm;
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.gstin_img !== undefined && files.gstin_img !== null && files.gstin_img !== "") {
            if (fileNotValid(files.gstin_img.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image"); else {
                s3Image['gstin_url'] = files.gstin_img
            }
            let name: string = "images/gstin_url/" + moment().unix() + "." + s3Image['gstin_url'].originalFilename.split(".").pop()
            const result = await uploadFile(s3Image['gstin_url'], name);
            if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
            s3Path['gstin_url'] = result.key;
            customer = Object.assign(customer, s3Path);
        }
        // update customer shipping address
        if (fields.shippingCity !== undefined && fields.shippingCity !== null && fields.shippingCity !== "")
            shippingAddress.city_id = fields.shippingCity;
        if (fields.shippingPincode !== undefined && fields.shippingPincode !== null && fields.shippingPincode !== "")
            shippingAddress.pincode = fields.shippingPincode
        if (fields.shippingAddress !== undefined && fields.shippingAddress !== null && fields.shippingAddress !== "")
            shippingAddress.address = fields.shippingAddress;
        if (fields.latitude !== undefined && fields.latitude !== null && fields.latitude !== "")
            shippingAddress.latitude = fields.latitude;
        if (fields.longitude !== undefined && fields.longitude !== null && fields.longitude !== "")
            shippingAddress.longitude = fields.longitude;
        // update billing address
        if (fields.billingAddress !== undefined && fields.billingAddress !== null && fields.billingAddress !== "")
            billingAddress.address = fields.billingAddress
        if (fields.billingPincode !== undefined && fields.billingPincode !== null && fields.billingPincode !== "")
            billingAddress.pincode = fields.billingPincode;
        if (fields.billingCity !== undefined && fields.billingCity !== null && fields.billingCity !== "")
            billingAddress.city_id = fields.billingCity;
        if (fields.billingState !== undefined && fields.billingState !== null && fields.billingState !== "")
            // billingAddress.state_id =fields.billingState
            if (fields.latitude !== undefined && fields.latitude !== null && fields.latitude !== "")
                billingAddress.latitude = fields.latitude
        if (fields.longitude !== undefined && fields.longitude !== null && fields.longitude !== "")
            billingAddress.longitude = fields.longitude
        if (Object.keys(customer).length) {
            await new CustomerModel().updateCustomer(customer, fields.id).then((data) => {
                console.log("updated successfully")
            })
        }
        if (Object.keys(billingAddress).length) {
            await new AddressModel().updateAddress(billingAddress, fields.id, 1).then((data) => {
                console.log("updated billing address")
            })
        }
        if (Object.keys(shippingAddress).length) await new AddressModel().updateAddress(shippingAddress, fields.id, 0).then((data) => {
            console.log("shipping address updated successfully")
        })
        return {message: "updated successfully "};
    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchCustomerById = async (id: any) => {
    try {
        let customers = await new CustomerModel().fetchCustomerById(id)
        if (customers.length == 0) throw new Error("Customer not found!");
        customers = customers[0];
        customers.gstin_img = config.baseUrl + "/" + customers.gstin_img
        customers.imgGst = ''
        customers.shipping = {}
        customers.shipping.state = {label: customers.shipping_state, value: customers.shipping_state_id};
        customers.shipping.city = {label: customers.shipping_city, value: customers.shipping_city_id};
        customers.shipping.address = customers.shippingAddress
        customers.shipping.pincode = customers.shippingPincode
        customers.billingCity = {label: customers.billing_city, value: customers.billing_city_id};
        customers.billingState = {label: customers.billing_state, value: customers.billing_state_id};
        if (customers.status == 1) {
            customers.status = {value: 1, label: "Active"};
        } else {
            customers.status = {value: 0, label: "Inactive"};
        }
        return customers;
    } catch (error: any) {
        return error
    }

}
const fetchAllCustomer = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let orderQuery: string;
    try {
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        } else {
            orderQuery = " ORDER BY cs.status DESC ";
        }
        let customers = await new CustomerModel().fetchAllCustomers(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        for (let i = 0; i < customers.length; i++) {
            // adding base url to panurl from database
            customers[i].gst = config.baseUrl + "/" + customers[0].gstin_url;
        }
        return customers;
    } catch (e) {
        return e
    }
}
const fetchAllCustomerCount = async (query: string) => {
    try {
        let customers = await new CustomerModel().fetchAllCustomerCount(query);
        return customers.length;
    } catch (error: any) {
        return error
    }
}

// customer-supplier mapping
const CreateCSMService = async (req: any) => {
    let result, suppliers: any
    try {
        if (req.body.customer_id !== undefined && req.body.customer_id !== null && req.body.customer_id !== "")
            if (req.body.supplier_id !== undefined && req.body.supplier_id !== null && req.body.supplier_id !== "")
                //  data= await new CustomerModel().fetchCustomerSupplier(req.body.customer_id,req.body.supplier_id)
                // if(data.length == 0) throw new Error("csm ids not found")
                // result = await new CustomerModel().createCSM(data[0])
                suppliers = req.body.supplier_id
        for (var i = 0; i < suppliers.length; i++) {
            result = await new CustomerModel().createCustomerSupplierMapping(req.body.customer_id, suppliers[i])
        }
        if (result.insertId == 0) {
            return {message: " entry not found ", insertId: result.insertId}
        }
        return {message: "added successfully ", insertId: result.insertId}
    } catch (e) {
        throw {message: "mapping already exists for this ids", e}
    }
}

const updateCSMService = async (req: any) => {
    let result, CSM;
    try {

        CSM = await new CustomerModel().fetchCSM(req.body.id)
        if (CSM.length == 0) throw new Error("id not found");
        result = await new CustomerModel().updateStatusById(req.body.id, req.body.status)
        LOGGER.info(" result", result)
        console.log(result)
        return {"changedRows": result.changedRows};
    } catch (e) {
        LOGGER.info("error", e)
        throw e
    }
}
const fetchAllCSM = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let orderQuery: string;
    try {
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        } else {
            orderQuery = " ";
        }
        let result = await new CustomerModel().fetchAllCustomerSuppliers(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        if (result.length == 0) throw new Error(" customer not found!")
        console.log("result : ", result)
        return result
    } catch (e) {
        throw e
    }
}
const fetchAllMappedSuppliers = async (customer_id: any) => {
    let result: any
    try {
        result = await new CustomerModel().fetchAllMappedSuppliers(customer_id)
        if (result.length == 0) throw new Error(" suppliers not found for the given customer")
        return result
    } catch (e) {
        throw e
    }
}
const fetchCSMCount = async (query: string) => {
    try {
        let customers_supplers = await new CustomerModel().fetch_csm_count(query);
        return customers_supplers.length;
    } catch (error: any) {
        return error
    }
}

const createCustomerEstimate = async (data: any) => {
    try {
        let customerData;
        console.log("estimate : ", data)
        let estimate: any = {};
        if (data.customer !== undefined && data.customer !== null && data.customer !== "")
            estimate.customer_id = data.customer;

        if (data.estimate_no !== undefined && data.estimate_no !== null && data.estimate_no !== "")
            estimate.estimate_no = data.estimate_no;

        if (data.product !== undefined && data.product !== null && data.product !== "")
            estimate.product_id = data.product;

        if (data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "")
            estimate.estimate_date = data.estimate_date;

        if (data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "")
            estimate.expiry_date = data.expiry_date;

        // if(data.estimate !== undefined && data.estimate !== null && data.estimate !== "")
        // estimate.estimate_id=data.estimate;

        if (data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
            estimate.raw_material_id = data.raw_material;

        if (data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
            estimate.packaging_id = data.packaging;

        if (data.product_description !== undefined && data.product_description !== null && data.product_description !== "")
            estimate.product_description = data.product_description;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            estimate.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            estimate.rate = data.rate;

        if (data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
            estimate.adjustment_amount = data.adjustment;

        if (data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
            estimate.customer_note = data.customer_note;

        if (data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
            estimate.tnc = data.tnc;

        if (data.status !== undefined && data.status !== null && data.status !== "") {
            estimate.status = data.status;
        } else {
            estimate.status = 0
        }
        console.log("estimate : ", estimate)
        let estimateData = await new CustomerModel().createCustomerEstimate(estimate)

        let log: any = {"estimate_id": estimateData.insertId, "stage": estimate.status, "user_id": data.user_id}
        await new CustomerModel().createCustomerEstimateStagelog(log)
        return estimateData;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const updateCustomerEstimate = async (data: any) => {
    try {
        let estimate: any = {}, est: any;
        if (data.id !== undefined && data.id !== null && data.id !== "")
            est = await new CustomerModel().estimateExistsOrNot(data.id);

        if (data.id !== undefined && data.id !== null && data.id !== "")
            est = await new CustomerModel().estimateExistsOrNot(data.id);
        if (est.length == 0) throw new Error("Estimate not found")

        if (data.customer !== undefined && data.customer !== null && data.customer !== "")
            estimate.customer_id = data.customer;

        if (data.estimate_no !== undefined && data.estimate_no !== null && data.estimate_no !== "")
            estimate.estimate_no = data.estimate_no;

        if (data.product !== undefined && data.product !== null && data.product !== "")
            estimate.product_id = data.product;

        if (data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "")
            estimate.estimate_date = data.estimate_date;

        if (data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "")
            estimate.expiry_date = data.expiry_date;

        if (data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
            estimate.raw_material_id = data.raw_material;

        if (data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
            estimate.packaging_id = data.packaging;

        if (data.product_description !== undefined && data.product_description !== null && data.product_description !== "")
            estimate.product_description = data.product_description;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            estimate.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            estimate.rate = data.rate;

        if (data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
            estimate.adjustment_amount = data.adjustment;

        if (data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
            estimate.customer_note = data.customer_note;

        if (data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
            estimate.tnc = data.tnc;

        if (data.status !== undefined && data.status !== null && data.status !== "") {
            estimate.status = data.status;
            let log: any = {"estimate_id": data.id, "stage": data.status, "user_id": data.user_id}
            if (estimate.status == -1) {
                // Estimate declined by customer
                LOGGER.info("Estimate is declined")
            }
            if (estimate.status == 0) {
                // initial state of the estimate
                LOGGER.info("Estimate is in draft state")
            }
            if (estimate.status == 1) {
                // need to integrate send an email functionaliey
                LOGGER.info("Pending for admin approval")
            }
            if (estimate.status == 2) {
                LOGGER.info("Approved by Admin.")
            }
            if (estimate.status == 3) {
                // need to integrate send an email functionaliey
                LOGGER.info("Email has been sent to the customer.")
            }
            if (estimate.status == 4) {
                // write code for estimate accespted by customer
                LOGGER.info("Accepted by Customer.")
            }
            if (estimate.status == 5) {
                LOGGER.info("Ready to convert into sales_order.")
            }

            await new CustomerModel().createCustomerEstimateStagelog(log)
        }

        let estimateData: any = await new CustomerModel().updateCustomerEstimateById(estimate, data.id)

//   `stage`  -1 as declined, 0 as draft, 1 as pending approval, 2 as approved, 3 as sent, 4 as accepted, 5 as Convert to SO',

        return estimateData;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchCustomerEstimateById = async (id: number) => {

    try {
        let estimate = await new CustomerModel().fetchCustomerEstimateById(id)
        if (estimate.length == 0) {
            throw new Error("estimate not found!")
//   `stage` int(11) DEFAULT NULL COMMENT 'Enum \n-1 as declined, 0 as draft, 1 as pending approval, 2 as approved, 3 as sent, 4 as accepted, 5 as Convert to SO',
        }
        switch (estimate[0].status) {
            case -1:
                estimate[0].status = {"value": -1, "label": "Declined"}
                break;
            case 0:
                estimate[0].status = {"value": 0, "label": "Draft"}
                break;
            case 1:
                estimate[0].status = {"value": 1, "label": "Pending for approval"}
                break;
            case 2:
                estimate[0].status = {"value": 2, "label": "Approved"}
                break;
            case 3:
                estimate[0].status = {"value": 3, "label": "Sent email"}
                break;
            case 4:
                estimate[0].status = {"value": 4, "label": "Accepted"}
                break;
            case 5:
                estimate[0].status = {"value": 5, "label": "Convert To SO"}
                break;
        }
        estimate[0].product = {"label": estimate[0].product, "value": estimate[0].product_id}
        estimate[0].customer = {"label": estimate[0].customer, "value": estimate[0].customer_id}
        estimate[0].raw_material = {"label": estimate[0].raw_material, "value": estimate[0].raw_material_id}
        estimate[0].packaging = {"label": estimate[0].packaging, "value": estimate[0].packaging_id}
        console.log(" Date before  : ", estimate[0].estimate_date, typeof estimate[0].estimate_date)
        // estimate[0].estimate_date = dayjs( estimate[0].estimate_date,'YYYY-MM-DD' ).toDate()
        // estimate[0].expiry_date = dayjs( estimate[0].expiry_date,'YYYY-MM-DD' ).toDate()
        console.log(" Date after  : ", estimate[0].estimate_date, typeof estimate[0].estimate_date)
        return estimate[0];

    } catch (error: any) {
        return error
    }

}

const fetchAllCustomerEstimates = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let orderQuery: string;
    try {
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        } else {
            orderQuery = " ORDER BY es.status DESC ";
        }
        let estimates = await new CustomerModel().fetchAllCustomerEstimates(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        return estimates;

    } catch (error: any) {
        return error
    }

}

const fetchAllCustomerEsimatesCount = async (query: string) => {
    try {
        let estimates = await new CustomerModel().fetchAllCustomerEstimatesCount(query);
        return estimates.length;
    } catch (error: any) {
        return error
    }
}

const createCustomerSalesOrder = async (data: any) => {
    try {
        let sales_order: any = {};

        if (data.customer !== undefined && data.customer !== null && data.customer !== "")
            sales_order.customer_id = data.customer;

        if (data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "")
            sales_order.estimate_id = data.estimate_id;

        if (data.so_date !== undefined && data.so_date !== null && data.so_date !== "")
            sales_order.so_date = data.so_date;

        if (data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "")
            sales_order.delivery_date = data.delivery_date;

        if (data.customer_so_number !== undefined && data.customer_so_number !== null && data.customer_so_number !== "")
            sales_order.sales_order_no = data.customer_so_number;

        if (data.product !== undefined && data.product !== null && data.product !== "")
            sales_order.product_id = data.product;

        if (data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
            sales_order.raw_material_id = data.raw_material;

        if (data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
            sales_order.packaging_id = data.packaging;

        if (data.product_description !== undefined && data.product_description !== null && data.product_description !== "")
            sales_order.product_description = data.product_description;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            sales_order.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            sales_order.rate = data.rate;

        if (data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
            sales_order.adjustment_amount = data.adjustment;

        if (data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
            sales_order.customer_note = data.customer_note;

        if (data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
            sales_order.tnc = data.tnc;
        // payment_term
        if (data.payment_term !== undefined && data.payment_term !== null && data.payment_term !== "")
            sales_order.payment_term = data.payment_term;

        if (data.status !== undefined && data.status !== null && data.status !== "") sales_order.status = data.status;
        else {
            sales_order.status = 1
        }

        let sales_order_data = await new CustomerModel().createCustomerSalesOrder(sales_order)
        let log: any = {"estimate_id": sales_order.estimate_id, "stage": 5, "user_id": data.user_id}
        await new CustomerModel().createCustomerEstimateStagelog(log)
        await new CustomerModel().updateCustomerEstimateById({'status': 5}, sales_order.estimate_id)
        return sales_order_data;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const updateCustomerSalesOrder = async (data: any) => {
    try {
        let sales_order: any = {}, dt: any;
        let id = data.id;
        dt = await new CustomerModel().salesOrderExistsOrNot(id);
        if (dt.length == 0) throw new Error("customer sales order not found ")

        if (data.customer !== undefined && data.customer !== null && data.customer !== "")
            sales_order.customer_id = data.customer;

        if (data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "")
            sales_order.estimate_id = data.estimate_id;

        if (data.so_date !== undefined && data.so_date !== null && data.so_date !== "")
            sales_order.so_date = data.so_date;

        if (data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "")
            sales_order.delivery_date = data.delivery_date;

        if (data.customer_so_number !== undefined && data.customer_so_number !== null && data.customer_so_number !== "")
            sales_order.sales_order_no = data.customer_so_number;

        if (data.product !== undefined && data.product !== null && data.product !== "")
            sales_order.product_id = data.product;

        if (data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "")
            sales_order.raw_material_id = data.raw_material;

        if (data.packaging !== undefined && data.packaging !== null && data.packaging !== "")
            sales_order.packaging_id = data.packaging;

        if (data.product_description !== undefined && data.product_description !== null && data.product_description !== "")
            sales_order.product_description = data.product_description;

        if (data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
            sales_order.quantity = data.quantity;

        if (data.rate !== undefined && data.rate !== null && data.rate !== "")
            sales_order.rate = data.rate;

        if (data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "")
            sales_order.adjustment_amount = data.adjustment;

        if (data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "")
            sales_order.customer_note = data.customer_note;

        if (data.tnc !== undefined && data.tnc !== null && data.tnc !== "")
            sales_order.tnc = data.tnc;
        // payment_term
        if (data.payment_term !== undefined && data.payment_term !== null && data.payment_term !== "")
            sales_order.payment_term = data.payment_term;

        if (data.status !== undefined && data.status !== null && data.status !== "")
            sales_order.status = data.status;

        let sales_order_data = await new CustomerModel().updateCustomerSalesOrder(sales_order, id)
        let log: any = {"estimate_id": sales_order.estimate_id, "stage": 5, "user_id": data.user_id}
        await new CustomerModel().createCustomerEstimateStagelog(log)
        return sales_order_data;

    } catch (e: any) {
        LOGGER.info("Exception =>", e.message);
        throw e;
    }
}

const fetchCustomerSalesOrderById = async (id: number) => {

    try {
        let sales_order = await new CustomerModel().fetchCustomerSalesOrderById(id)
        if (sales_order.length == 0) {
            throw new Error("Sales order not found!")
        }
        sales_order[0].customer = {"label": sales_order[0].customer, "value": sales_order[0].customer_id}
        sales_order[0].raw_material = {"label": sales_order[0].raw_material, "value": sales_order[0].raw_material_id}
        sales_order[0].packaging = {"label": sales_order[0].packaging, "value": sales_order[0].packaging_id}
        sales_order[0].product = {"label": sales_order[0].product, "value": sales_order[0].product_id}

        if (sales_order[0].status === 1) {
            sales_order[0].status = {"label": "Approved", "value": sales_order[0].status}
        } else if (sales_order[0].status === -1) {
            sales_order[0].status = {"label": "Rejected", "value": sales_order[0].status}
        }
        return sales_order;

    } catch (error: any) {
        return error
    }

}
const fetchAllCustomerSalesOrders = async (pageIndex: number, pageSize: number, sort: any, query: string) => {
    let orderQuery: string;

    try {
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        } else {
            orderQuery = " ORDER BY cs.status DESC ";
        }
        let sales_order = await new CustomerModel().fetchAllCustomerSalesOrders(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
        return sales_order;

    } catch (error: any) {
        return error
    }
}
const fetchAllActiveCustomerService = async () => {
    try {
        let customer = await new CustomerModel().fetchALLActiveCustomers()
        if (customer.length == 0) throw new Error("customer not found")
        // for(var i = 0 ; i < customer.length; i++) {
        //     let label = customer[i].name + ','+ customer[i].city
        //     customer[i].lable = label
        //     delete customer[i].name
        //     delete customer[i].city
        // }
        return {address: customer}
    } catch (error: any) {
        return error
    }
}
const fetchAllCustomerSalesOrdersCount = async (query: string) => {
    try {
        let customers = await new CustomerModel().fetchAllCustomerSalesOrdersCount(query);
        return customers.length;
    } catch (error: any) {
        return error
    }
}
const fetchAllCustomersJson = async (query: string) => {
    try {
        let result = await new CustomerModel().fetchAllCustomersJson(query);
        if (result.length === 0) {
            throw new Error("Customers not found!")

        } else {
            return result
        }
    } catch (err) {
        return err
    }
}
const fetchSuppliers = async (req: any) => {
    try {
        let address_id = req.query.address_id
        let suppliers = await new CustomerModel().fetchAllmappedSuppliersByAddressId(address_id)
        if (suppliers.length == 0) throw new Error("customer not found")
        return {suppliers: suppliers}
    } catch (error: any) {
        return error
    }
}
const fetchAllCustomersSOList = async (query: string) => {
    try {
        let result = await new CustomerModel().fetchAllCustomersSOList(query);
        if (result.length === 0) {
            throw new Error("Customer Sales orders not found!")

        } else {
            return result
        }
    } catch (err) {
        return err
    }
}
const fetchAllMappedSuppliersByCustomerId = async (pageIndex: number, pageSize: number, sort: any, query: string, condition: string) => {
    let orderQuery: string;
    try {
        if (sort.key != "") {
            orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
        } else {
            orderQuery = " ORDER BY cs.status DESC ";
        }
        let customers = await new CustomerModel().fetchAllMappedSuppliersByCustomerId(pageSize, (pageIndex - 1) * pageSize, orderQuery, query, condition)
        for (let i = 0; i < customers.length; i++) {
            // adding base url to panurl from database
            customers[i].latest_factory_rate = 101 + i;
            customers[i].latest_delivered_rate = 101 + i;
            customers[i].qf_rate = 10 + i;
            customers[i].qd_rate = 101 + i;
            customers[i].t_rate = 10 + i + i;
            customers[i].q_qty = 10 + i * i;
        }
        return customers;
    } catch (e) {
        return e
    }
}
const fetchAllMappedSuppliersByCustomerIdCount = async (query: string, condition: string) => {
    try {
        let customers = await new CustomerModel().fetchAllMappedSuppliersByCustomerIdCount(query, condition);
        return customers.length;
    } catch (error: any) {
        return error
    }
}
export default {
    createCustomer,
    fetchCustomerById,
    updateCustomerdetails,
    fetchAllCustomer,
    fetchAllCustomerCount,
    CreateCSMService,
    updateCSMService,
    fetchAllCSM,
    fetchCSMCount,
    createCustomerEstimate,
    updateCustomerEstimate,
    fetchCustomerEstimateById,
    fetchAllCustomerEstimates,
    createCustomerSalesOrder,
    updateCustomerSalesOrder,
    fetchCustomerSalesOrderById,
    fetchAllCustomerSalesOrders, fetchAllMappedSuppliers,
    fetchAllCustomerEsimatesCount,
    fetchAllCustomerSalesOrdersCount,
    fetchAllCustomersJson,
    fetchAllActiveCustomerService, fetchSuppliers,
    fetchAllCustomersSOList,
    fetchAllMappedSuppliersByCustomerId,
    fetchAllMappedSuppliersByCustomerIdCount
}