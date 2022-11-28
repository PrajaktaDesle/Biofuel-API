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

// const fileNotValid = (type: any) => {
//     if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
//         return false;
//     }
//     return true;
// };

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

// const fetchAllestimateCategories= async () => {

//     try {
//         let estimateC = await new estimateModel().fetchAllestimateCategories()
//         if (estimateC.length == 0) {
//             throw new Error("estimate categories not found!")
//         }
       
//         return estimateC;

//     }
//     catch (error: any) {
//         return error
//     }

// }

// const fetchAllestimateUsageUnits= async () => {

//     try {
//         let estimateUU = await new estimateModel().fetchAllestimateUsageUnits()
//         if (estimateUU.length == 0) {
//             throw new Error("estimate usagae units not found!")
//         }
       
//         return estimateUU;

//     }
//     catch (error: any) {
//         return error
//     }

// }
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


// const updateestimateById = async (req: any) => {

//     try {
//         let estimate: any = {}
//         let fields, files;
//         //@ts-ignore
//         ({ fields, files } = await new Promise((resolve) => {
//             new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
//                 resolve({ fields: fields, files: files })
//             })
//         }))
//         if (fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");

//         // supplier exists or not
//         let pd = await new estimateModel().fetchestimateById(fields.id)
//         if (pd.length == 0) throw new Error("estimate not found!")

//         // Fields validation
//         if (fields.estimate !== undefined && fields.estimate !== null && fields.estimate !== "")
//             estimate.estimate = fields.estimate;
//         if (fields.description !== undefined && fields.description !== null && fields.description !== "")
//             estimate.description = fields.description;
//         if (fields.hsn !== undefined && fields.hsn !== null && fields.hsn !== "")
//             estimate.hsn = fields.hsn;
//         if (fields.gst !== undefined && fields.gst !== null && fields.gst !== "")
//             estimate.gst = fields.gst;
//         if (fields.usage_unit !== undefined && fields.usage_unit !== null && fields.usage_unit !== ""){
//          estimate.usage_unit_id = fields.usage_unit }
//         if (fields.category !== undefined && fields.category !== null && fields.category !== ""){
//         estimate.category_id=fields.category }
        
//         // Files validation
//         if (files.image !== undefined && files.image !== null && files.image !== "") {
//             if (fileNotValid(files.image.mimetype)){ throw new Error("Only .png, .jpg and .jpeg format allowed! for image") }
//             else{ 
//                   let estimate: string = "images/image/" + moment().unix() + "." + files['image'].originalFilecustomer.split(".").pop()
//                   const result = await uploadFile(files['image'], estimate);
//                   if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
//                   console.log("s3 result  : ", result)
//                   estimate['image'] = result.key;
//                 }
//         }
//         console.log( 'estimate : ',estimate )
//         let estimateData = await new estimateModel().updateestimateById( estimate, fields.id )
//         return estimateData;

//     }
//     catch (error: any) {
//         return error
//     }

// }


// const updateestimateStatus = async (data: any) => {

//     try {
//         let estimateObj = new estimateModel()
//         let estimate = await new estimateModel().fetchestimateById( data.id )
//         if( estimate.length == 0 ) throw new Error( "estimate not found")
//         let estimateData = await new estimateModel().updateestimateById(data, data.id);
//         LOGGER.info( "estimate details", estimateData )
//         console.log( estimateData )
//         return {"changedRows":estimateData.changedRows};
//     }
//     catch (e){
//         throw e; 
//     }


// }

export default {
    createEstimate,
    updateEstimate,
    fetchEstimateById,
    fetchAllestimates
    // updateestimateById,
    // fetchAllestimates,
    // updateestimateStatus,
    // fetchAllestimateCategories,
    // fetchAllestimateUsageUnits
}