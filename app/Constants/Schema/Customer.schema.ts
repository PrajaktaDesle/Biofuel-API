import { Joi, Segments } from 'celebrate';
import { join } from 'path';
export default {
    
    createCustomerEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            customer: Joi.number().required(),
            estimate_id: Joi.number().integer().required(),
            estimate_date: Joi.string().required(),
            expiry_date: Joi.string().required(),
            product: Joi.number().required(),
            raw_material: Joi.number().required(),
            product_description: Joi.string().required(),
            packaging: Joi.number().required(),
            rate: Joi.number().required(),
            quantity: Joi.number().required(),
            customer_note: Joi.string().required(),
            tnc: Joi.string().required(),
            status: Joi.number().required(),
            user_id: Joi.number().required(),
    }).unknown(),
    },
    updateCustomerEstimate: {
        [Segments.BODY]:  Joi.object().keys({
            id: Joi.number().required(),
            customer: Joi.number().optional(),
            estimate_id: Joi.number().integer().optional(),
            estimate_date: Joi.string().optional(),
            expiry_date: Joi.string().optional(),
            product: Joi.number().optional(),
            raw_material: Joi.number().optional(),
            product_description: Joi.string().optional(),
            packaging: Joi.number().optional(),
            rate: Joi.number().optional(),
            quantity: Joi.number().optional(),
            customer_note: Joi.string().optional(),
            tnc: Joi.string().optional(),
            status: Joi.number().optional(),
            user_id: Joi.number().optional(),
    }).unknown(),
    },
    fetchCustomerEstimateById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },
    

};
