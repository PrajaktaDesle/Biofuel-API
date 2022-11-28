import { EstimateModel } from "../Models/Estimates/Estimates.Model";
const { v4: uuidv4 } = require('uuid');
let config = require('../config')

const createEstimate = async (data: any) => {
    try {
        let customerData;
        let estimate:any = {};
        if(data.customer !== undefined && data.customer !== null && data.customer !== "") 
        estimate.customer_id=data.customer;

        if(data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "") 
        estimate.estimate_no=data.estimate_id;

        if(data.product !== undefined && data.product !== null && data.product !== "") 
        estimate.product_id=data.product;

        if(data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "") 
        estimate.estimate_date=data.estimate_date;

        if(data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "") 
        estimate.expiry_date=data.expiry_date;

        if(data.estimate !== undefined && data.estimate !== null && data.estimate !== "") 
        estimate.estimate_id=data.estimate;

        if(data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "") 
        estimate.raw_material_id=data.raw_material;

        if(data.packaging !== undefined && data.packaging !== null && data.packaging !== "") 
        estimate.packaging_id=data.packaging;

        if(data.estimate_description !== undefined && data.estimate_description !== null && data.estimate_description !== "") 
        estimate.estimate_description=data.estimate_description;

        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "") 
        estimate.quantity=data.quantity;

        if(data.rate !== undefined && data.rate !== null && data.rate !== "") 
        estimate.rate=data.rate;

        if(data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "") 
        estimate.adjustment_amount=data.adjustment;

        if(data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "") 
        estimate.customer_note=data.customer_note;

        if(data.tnc !== undefined && data.tnc !== null && data.tnc !== "") 
        estimate.tnc=data.tnc;

        if(data.status !== undefined && data.status !== null && data.status !== "") 
        estimate.status=data.status;
        
        let estimateData = await new EstimateModel().createCustomerEstimate(estimate)
        return estimateData;

    } catch (e: any) {
        console.log("Exception =>", e.message);
        throw e;
    }
}

const updateEstimate = async (data: any) => {
    try {
        let estimate:any = {}, est:any;
        
        if(data.id !== undefined && data.id !== null && data.id !== "") 
        est= await new EstimateModel().estimateExistsOrNot(data.id);
        if (est.length == 0 ) throw new Error( "Estimate not found ")

        if(data.customer !== undefined && data.customer !== null && data.customer !== "") 
        estimate.customer_id=data.customer;

        if(data.estimate_id !== undefined && data.estimate_id !== null && data.estimate_id !== "") 
        estimate.estimate_no=data.estimate_id;

        if(data.product !== undefined && data.product !== null && data.product !== "") 
        estimate.product_id=data.product;

        if(data.estimate_date !== undefined && data.estimate_date !== null && data.estimate_date !== "") 
        estimate.estimate_date=data.estimate_date;

        if(data.expiry_date !== undefined && data.expiry_date !== null && data.expiry_date !== "") 
        estimate.expiry_date=data.expiry_date;

        if(data.estimate !== undefined && data.estimate !== null && data.estimate !== "") 
        estimate.estimate_id=data.estimate;

        if(data.raw_material !== undefined && data.raw_material !== null && data.raw_material !== "") 
        estimate.raw_material_id=data.raw_material;

        if(data.packaging !== undefined && data.packaging !== null && data.packaging !== "") 
        estimate.packaging_id=data.packaging;

        if(data.estimate_description !== undefined && data.estimate_description !== null && data.estimate_description !== "") 
        estimate.estimate_description=data.estimate_description;

        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "") 
        estimate.quantity=data.quantity;

        if(data.rate !== undefined && data.rate !== null && data.rate !== "") 
        estimate.rate=data.rate;

        if(data.adjustment !== undefined && data.adjustment !== null && data.adjustment !== "") 
        estimate.adjustment_amount=data.adjustment;

        if(data.customer_note !== undefined && data.customer_note !== null && data.customer_note !== "") 
        estimate.customer_note=data.customer_note;

        if(data.tnc !== undefined && data.tnc !== null && data.tnc !== "") 
        estimate.tnc=data.tnc;

        if(data.status !== undefined && data.status !== null && data.status !== "") 
        estimate.status=data.status;

        let estimateData:any = await new EstimateModel().updateCustomerEstimateById(estimate, data.id )
        return estimateData;

    } catch (e: any) {
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fetchEstimateById = async (id: number) => {

    try {
        let estimate = await new EstimateModel().fetchCustomerEstimateById(id)
        if (estimate.length == 0) {
            throw new Error("estimate not found!")
        }
       
        return estimate;

    }
    catch (error: any) {
        return error
    }

}

const fetchAllestimates = async () => {

    try {
        let estimates = await new EstimateModel().fetchAllCustomerEstimates()
        if( estimates.length == 0 ){
            throw new Error( "Estimates not found")
        }
      
        return estimates;

    }
    catch (error: any) {
        return error
    }

}



export default {
    createEstimate,
    updateEstimate,
    fetchEstimateById,
    fetchAllestimates
   
}