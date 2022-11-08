import { Joi, Segments } from 'celebrate';
import { join } from 'path';
export default {
    register: {
        [Segments.BODY]:  Joi.object().keys({
            name: Joi.string().min(1).required(),
            pincode: Joi.number().required(),
            billing_address: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            plant_address: Joi.string().required(),
            contact_no: Joi.string().required(),
            gstin_no: Joi.number().required(),
    }).unknown(),
    },
   
    fetchCustomerById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },


    updateCustomerDetails: {
        [Segments.BODY]:  Joi.object().keys({

            id: Joi.number().required(),
            name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            billing_address: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            plant_address: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            email: Joi.string().email().optional(),
            contact_no:Joi.string().optional().min(10).message("contact_no length should be 10").max(10).message("contact_no length should be 10"),
            gstin_no : Joi.number().optional(),
            status:Joi.number().optional().min(0).message("minimum status should be 0 or 1").max(1).message("minimum status should be 0 or 1")
        }).unknown(),
    },

};
