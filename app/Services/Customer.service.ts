import LOGGER from "../config/LOGGER";
import {CustomerModel} from "../Models/Customer/Customer.model";
const {v4 : uuidv4} = require('uuid');
let config = require("../config");

const createCustomer = async (data:any) =>{
    try{
        let customerData;
        let customer:any = {};
        if(data.name !== undefined && data.name !== null && data.name !== "") 
        customer.name=data.name;
        if(data.pincode !== undefined && data.pincode !== null && data.pincode !== "")
        customer.pincode=data.pincode;
        if(data.billing_address !== undefined && data.billing_address !== null && data.billing_address !== "") 
        customer.billing_address=data.billing_address;
        if(data.plant_address !== undefined && data.plant_address !== null && data.plant_address !== "") 
        customer.plant_address=data.plant_address;
        if(data.gstin_no !== undefined && data.gstin_no !== null && data.gstin_no !== "") 
        customer.gstin_no=data.gstin_no;
        if(data.mobile !== undefined && data.mobile !== null && data.mobile !== "") 
        customer.mobile=data.mobile;
        if(data.city !== undefined && data.city !== null && data.city !== "") 
        customer.city=data.city;
        if(data.user_id !== undefined && data.user_id !== null && data.user_id !== "") 
        customer.user_id=data.user_id
        customerData = await new CustomerModel().createUser( customer )
        if (!customerData) throw new Error("Registration failed");
      
        return customerData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

const fetchAllCustomers = async () =>{
    let customerData;
    customerData = await new CustomerModel().fetchAllUsers( 3 )
    if (customerData == null) throw new Error("details did not match");
    return customerData;
}


const fetchCustomerById = async (id: any) => {
    try {
        let customer = await new CustomerModel().fetchUserById( id, 3);
        if (customer.length == 0) throw new Error("No Customer found");
        return customer[0];
    }
    catch (e){
        return e;
    }
}


const updateCustomerDetails = async (data:any) => {
    try {
        let customer = await new CustomerModel().updateUserDetails( data, data.id, 3);
        if (customer.length == 0) throw new Error("customer updation failed");
        return customer[0];
    }
    catch (e){
        throw e;
    }
}


export default {
    createCustomer,
    fetchAllCustomers,
    fetchCustomerById,
    updateCustomerDetails,
}
