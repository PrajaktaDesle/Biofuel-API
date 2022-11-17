import { Joi, Segments } from 'celebrate';
import { join } from 'path';
export default {
    createCustomersPO: {
        [Segments.BODY]:  Joi.object().keys({
            customer: Joi.string().min(1).required(),
            po_number: Joi.number().required(),
            product_code: Joi.number().required().min(1).message("Length should be greater than 1 character"),
            po_date: Joi.string().min(1).required(),
            quantity: Joi.number().required(),
            delivery_date: Joi.string().required(),
            total_value: Joi.number().required(),
            user_id: Joi.number().required(),
    }).unknown(),
    },
   
    fetchCustomersPO:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },


    updateCustomersPODetails: {
        [Segments.BODY]:  Joi.object().keys({

            id: Joi.number().required(),
            name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            po_number: Joi.number().optional().min(1).message("Length should be greater than 1 character"),
            product_code: Joi.number().optional().min(1).message("Length should be greater than 1 character"),
            po_date: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            quantity: Joi.number().optional(),
            delivery_date: Joi.string().optional(),
            total_value: Joi.number().optional(),
            status:Joi.number().optional().min(0).message("minimum status should be 0 or 1").max(1).message("minimum status should be 0 or 1")
        }).unknown(),
    },

};
