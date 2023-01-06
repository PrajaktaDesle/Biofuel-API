import { Joi, Segments } from 'celebrate';
// @ts-ignore
import { CustomerModel } from '../../Models/Customer/Customer.model'

export default {
    
    createCustomerEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            customer: Joi.number().required(),
            estimate_no: Joi.number().integer().required(),
            estimate_date: Joi.string().required(),
            expiry_date: Joi.string().required(),
            product: Joi.number().required(),
            raw_material: Joi.number().required(),
            // product_description: Joi.string().required(),
            packaging: Joi.number().required(),
            rate: Joi.number().required(),
            quantity: Joi.number().required(),
            // customer_note: Joi.string().required(),
            // tnc: Joi.string().required(),
            status: Joi.number().optional(),
            user_id: Joi.number().required(),
    }).unknown(),
    },
    updateCustomerEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            id: Joi.number().required(),
            customer: Joi.number().optional(),
            estimate_no: Joi.number().integer().optional(),
            estimate_date: Joi.string().optional(),
            expiry_date: Joi.string().optional(),
            product: Joi.number().optional(),
            raw_material: Joi.number().optional(),
            // product_description: Joi.any().optional(),
            packaging: Joi.number().optional(),
            rate: Joi.number().optional(),
            quantity: Joi.number().optional(),
            // customer_note: Joi.any().optional(),
            // tnc: Joi.any().optional(),
            status: Joi.number().optional(),
            user_id: Joi.number().optional(),
    }).unknown(),
    },
    fetchCustomerEstimateById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },
    customer_supplier: {
        [Segments.BODY]:  Joi.object().keys({
            customer_id: Joi.number().required(),
            supplier_id: Joi.array().required()
        }).unknown()
    },
    updateStatus: {
        [Segments.BODY]:  Joi.object().keys({
            // id:Joi.number().required(),
            customer_id : Joi.number().required(),
            supplier_id : Joi.number().required(),
            status: Joi.number().required().min(0).max(1)
        }).unknown()
    },
     getsuppliers: {
        [Segments.QUERY]:  Joi.object().keys({
            address_id:Joi.number().required(),
        }).unknown()
    },
    getsuppliersByCustomerId: {
        [Segments.BODY]:  Joi.object().keys({
            customer_id:Joi.number().required(),
        }).unknown()
    },
    createCustomerSalesOrder: {
        [Segments.BODY]:  Joi.object().keys({
            customer: Joi.number().required(),
            estimate_id: Joi.number().integer().required(),
            // sales_order_id: Joi.number().integer().required(),
            customer_so_number: Joi.number().integer().required(),
            so_date: Joi.string().required(),
            delivery_date: Joi.string().required(),
            product: Joi.number().required(),
            raw_material: Joi.number().required(),
            // product_description: Joi.string().required(),
            packaging: Joi.number().required(),
            rate: Joi.number().required(),
            quantity: Joi.number().required(),
            // customer_note: Joi.string().required(),
            // tnc: Joi.string().required(),
            status: Joi.number().optional(),
            user_id: Joi.number().required(),
    }).unknown(),

    
    },
    updateCustomerSalesOrderById: {
        [Segments.BODY]:  Joi.object().keys({
            id: Joi.number().required(),
            customer: Joi.number().optional(),
            estimate_id: Joi.number().integer().optional(),
            sales_order_id: Joi.number().integer().optional(),
            customer_so_number: Joi.number().integer().optional(),
            so_date: Joi.string().optional(),
            delivery_date: Joi.string().optional(),
            product: Joi.number().optional(),
            raw_material: Joi.number().optional(),
            // product_description: Joi.string().optional(),
            packaging: Joi.number().optional(),
            rate: Joi.number().optional(),
            quantity: Joi.number().optional(),
            // customer_note: Joi.string().optional(),
            // tnc: Joi.string().optional(),
            status: Joi.number().optional(),
            user_id: Joi.number().optional(),
    }).unknown(),

   },
   fetchCustomerSalesOrderById:{
    [Segments.QUERY]:{
        id:Joi.number().required()
    }
}
}
