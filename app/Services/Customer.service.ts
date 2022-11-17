import LOGGER from "../config/LOGGER";
import {CustomerModel} from "../Models/Customer/Customer.model";
const {v4 : uuidv4} = require('uuid');
let config = require("../config");

const createCustomer = async (data:any) =>{
    try{
        let customerData;
        let customer:any = {};
        let profile:any = {};
        let addressBill:any = {};
        let addressPlant:any = {};
        if(data.name !== undefined && data.name !== null && data.name !== "") 
        customer.name=data.name;
        if(data.email !== undefined && data.email !== null && data.email !== "") 
        customer.email=data.email;
        if(data.contact_no !== undefined && data.contact_no !== null && data.contact_no !== "") 
        customer.mobile=data.contact_no;

        if(data.gstin_no !== undefined && data.gstin_no !== null && data.gstin_no !== "") 
        profile.gstin_no=data.gstin_no;

        if(data.billing_address !== undefined && data.billing_address !== null && data.billing_address !== ""){addressBill.address=data.billing_address;addressBill.address_type="bill"; }
        if(data.plant_address !== undefined && data.plant_address !== null && data.plant_address !== ""){ addressPlant.address=data.plant_address; addressPlant.address_type="plant"; }
        if(data.pincode !== undefined && data.pincode !== null && data.pincode !== ""){ addressBill.pincode=data.pincode; addressPlant.pincode=data.pincode; } 
        if(data.city !== undefined && data.city !== null && data.city !== ""){ addressBill.city=data.city; addressPlant.city=data.city; }
        customer.role_id = 2;
        customerData = await new CustomerModel().createUser( customer )
        if (!customerData) throw new Error("Registration failed");
        let id = customerData.insertId;
        if ( profile ) profile['user_id'] = id; await new CustomerModel().createCustomerProfile( profile ); 
        if ( addressBill )  addressBill['user_id'] = id; await new CustomerModel().createCustomerAddress( addressBill );
        if ( addressPlant )  addressPlant['user_id'] = id; await new CustomerModel().createCustomerAddress( addressPlant );
        return customerData;
    }catch(e){
        console.log("Exception ->", e);
        throw e;
    }
}

const fetchAllCustomers = async () =>{
    let customerData;
    customerData = await new CustomerModel().fetchAllUsers( 2 )
    if (customerData.length == 0) throw new Error("No Customer found");
    
    return customerData;
}


const fetchCustomerById = async (id: any) => {
    try {
        let CustomerObj =  new CustomerModel()
        let customer = await CustomerObj.fetchUserById( id, 2 );
        if (customer.length == 0) throw new Error("No Customer found");
        let profile = await CustomerObj.fetchCustomersProfileById( id )
        let addressBill = await CustomerObj.fetchCustomersAddressById( id , 'bill' )
        let addressPlant = await CustomerObj.fetchCustomersAddressById( id , 'plant' )
        addressBill[0].billing_address = addressBill[0].address
        addressPlant[0].plant_address = addressPlant[0].address
        Object.assign( customer[0], profile[0], addressBill[0], addressPlant[0]);
        delete customer[0].address;
        return customer[0];
    }
    catch (e){
        return e;
    }
}


const updateCustomerDetails = async (data:any) => {
    try {
        let customer : any = {};
        let profile : any  = {};
        let customerData;

        let cs = await new CustomerModel().fetchUserById( data.id, 2 )
        if ( cs.length == 0) throw new Error("customer not found ");

        if(data.name !== undefined && data.name !== null && data.name !== "") 
        customer.name=data.name;
        if(data.email !== undefined && data.email !== null && data.email !== "") 
        customer.email=data.email;
        if(data.contact_no !== undefined && data.contact_no !== null && data.contact_no !== "") 
        customer.mobile=data.contact_no;
         
        if(data.gstin_no !== undefined && data.gstin_no !== null && data.gstin_no !== "") 
        profile.gstin_no=data.gstin_no;
        let CustomerObj = new CustomerModel();
        if( customer ) {  customerData = await CustomerObj.updateUserDetails( data, data.id, 2 ); }
        if( profile ) { let profileData = await CustomerObj.updateCustomersProfileDetails( data, data.id ); }
        if( profile ) { let addressData = await CustomerObj.updateCustomersAddressDetails( data, data.id ); }
        return customerData[0];
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
