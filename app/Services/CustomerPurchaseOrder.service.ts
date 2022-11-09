import LOGGER from "../config/LOGGER";
import {CustomerPOModel} from "../Models/CustomerPurchaseOrder/CustomerPurchaseOrder.model";
const {v4 : uuidv4} = require('uuid');
let config = require("../config");

const createCustomerPO = async (data:any) =>{
    try{
        let customerData;
        let customer:any = {};
        if(data.customer !== undefined && data.customer !== null && data.customer !== "") 
        customer.customer=data.customer;
        if(data.po_number !== undefined && data.po_number !== null && data.po_number !== "")
        customer.po_number=data.po_number;
        if(data.product_code !== undefined && data.product_code !== null && data.product_code !== "") 
        customer.product_code=data.product_code;
        if(data.po_date !== undefined && data.po_date !== null && data.po_date !== "") 
        customer.po_date=data.po_date;
        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "") 
        customer.quantity=data.quantity;
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") 
        customer.delivery_date=data.delivery_date;
        if(data.total_value !== undefined && data.total_value !== null && data.total_value !== "") 
        customer.total_value=data.total_value;
        if(data.user_id !== undefined && data.user_id !== null && data.user_id !== "") 
        customer.user_id=data.user_id
        customerData = await new CustomerPOModel().createCustomerPO(customer)
        if (!customerData) throw new Error("customer purchase order creation failed");
      
        return customerData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

const fetchAllCustomerPO = async () =>{
    let customerData;
    customerData = await new CustomerPOModel().findAllcustomersPO()
    if (customerData == null) throw new Error("details did not match");
    return customerData;
}


const fetchCustomersPO = async (id: any) => {
    try {
        let customer = await new CustomerPOModel().findCustomersPO(id);
        if (customer.length == 0) throw new Error("Customers purchase order  not found");
        return customer[0];
    }
    catch (e){
        return e;
    }
}


const updateCustomerPODetails = async (data:any) => {
    try {
        let cpo = await new CustomerPOModel().findCustomersPO( data.id )
        if ( cpo.length == 0 ) return new Error( "customer purchase order not found")
        let customer : any = {};
        if(data.id !== undefined && data.id !== null && data.id !== "") 
        customer.id=data.id;
        if(data.customer !== undefined && data.customer !== null && data.customer !== "") 
        customer.customer=data.customer;
        if(data.po_number !== undefined && data.po_number !== null && data.po_number !== "")
        customer.po_number=data.po_number;
        if(data.product_code !== undefined && data.product_code !== null && data.product_code !== "") 
        customer.product_code=data.product_code;
        if(data.po_date !== undefined && data.po_date !== null && data.po_date !== "") 
        customer.po_date=data.po_date;
        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "") 
        customer.quantity=data.quantity;
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") 
        customer.delivery_date=data.delivery_date;
        if(data.total_value !== undefined && data.total_value !== null && data.total_value !== "") 
        customer.total_value=data.total_value;
        
        let customerData = await new CustomerPOModel().updateCustomerPODetails(customer);
        console.log( "customerData  : ", customerData )
        return customerData;
    }
    catch (e){
        throw e;
    }
}


export default {
    createCustomerPO,
    fetchAllCustomerPO,
    fetchCustomersPO,
    updateCustomerPODetails,
}
