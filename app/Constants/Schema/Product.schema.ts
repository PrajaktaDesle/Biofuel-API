import { Joi, Segments } from 'celebrate';
export default {
   
    login: { 
        [Segments.BODY]: {
            mobile:Joi.string().required().min(10).message("mobile length should be 10").max(10).message("mobile length should be 10"),
        }
    },
    verify_otp: {
        [Segments.BODY]:{
            otp: Joi.number().required(),
            request_id: Joi.string().required()
        }

    },

    fetchSupplierById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },


    updateSupplierDetails: {
        [Segments.BODY]: {
            id: Joi.number().required(),
            first_name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            middle_name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            last_name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            email: Joi.string().email().optional(),
            mobile:Joi.string().optional().min(10).message("mobile length should be 10").max(10).message("mobile length should be 10"),
            status:Joi.number().optional().min(0).message("minimum status should be 0 or 1").max(1).message("minimum status should be 0 or 1")
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },

};
