import LOGGER from "../config/LOGGER";
import Customer_supplier_mapping_model from "../Models/customer-supplier-mappling/customer_supplier_mapping";


const CreateCSMService = async(req:any)=>{
    let result, customer, supplier, customer_address;
    let data:any={}
    try{
        if (req.body.customer_id !== undefined &&  req.body.customer_id !== null && req.body.customer_id !== "")
            customer = await new Customer_supplier_mapping_model().fetchCustomers(req.body.customer_id)
            if (customer.length == 0) throw new Error("customer not found");
            // console.log('customers------------------>',customer)
            customer_address = await new Customer_supplier_mapping_model().fetchAddressID(req.body.customer_id)
            if (customer_address.length == 0) throw new Error("id not found");
            // console.log('in service customer_address_id------>', customer_address)
            data.address_id = customer_address[0].id
        if (req.body.customer_id !== undefined &&  req.body.customer_id !== null && req.body.customer_id !== "")
             supplier = await new Customer_supplier_mapping_model().fetchSupplier(req.body.supplier_id)
             if (supplier.length == 0) throw new Error("Supplier not found");
            data.customer_id = customer[0].id
            data.supplier_id = supplier[0].id
            let CSM = await new Customer_supplier_mapping_model().fetchCSM(req.body.customer_id, req.body.supplier_id)
            if(CSM.length !== 0) throw new Error(" id already present")
            result = await new Customer_supplier_mapping_model().createCSM(data)
            return {message:"added successfully ",insertId:result.insertId}
    }catch (e) {
        throw e
    }
}

const updateCSMService = async(req:any)=>{
    let result,CSM, data;
    try{
 
        CSM = await new Customer_supplier_mapping_model().fetchCSM(req.body.customer_id,req.body.supplier_id)
        if(CSM.length == 0) throw new Error("id not found");
        data = {"status":req.body.status }
        console.log("data in service------>", data)
        result = await new Customer_supplier_mapping_model().updateStatusById(data, req.body.customer_id,req.body.supplier_id)
        LOGGER.info( "Product details", result )
        console.log( result )
        return {"changedRows":result.changedRows};
    }catch (e) {
        console.log("error----------->",e)
        throw e
    }
}
const fetchAllCSM = async()=>{
    try {
        let result, customer_name, suppiler_name, address;
        result = await new Customer_supplier_mapping_model().fetchAll()
        for (let i = 0; i < result.length; i++) {
            customer_name = await new Customer_supplier_mapping_model().fetchCustomers(result[i].customer_id)
            suppiler_name = await new Customer_supplier_mapping_model().fetchSupplier(result[i].supplier_id)
            address = await new Customer_supplier_mapping_model().fetchCity(result[i].address_id)
            let city = await new Customer_supplier_mapping_model().fetchCustomerCity(address[0].city_id)
            // console.log('city in service---------------------------------------------->',city)
            // console.log('customer name --------------->', customer_name, suppiler_name, address)
            result[i].customer = customer_name[0].name
            result[i].supplier = suppiler_name[0].name
            result[i].city = city[0].name
            result[i].address =address[0].address
            delete result[i].customer_id
            delete result[i].supplier_id
            delete result[i].address_id
        }
        return result
    }catch (e) {
        throw e
    }
}

export default {CreateCSMService,updateCSMService, fetchAllCSM}