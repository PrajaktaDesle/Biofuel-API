import { Joi, Segments } from 'celebrate';
export default {
    register: {
        [Segments.BODY]: {
            first_name: Joi.string().min(1).required(),
            middle_name: Joi.string().required(),
            last_name: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required(),
            confirm_password: Joi.string().min(6).max(32).required(),
            mobile: Joi.string().required(),
            user_id: Joi.number().required(),
            tenant_id: Joi.number().required(),
            status: Joi.number().required(),
            dob: Joi.string().required(),
            reg_date: Joi.string().required(),
            pancard_url:Joi.string().required(),
            aadhar_url:Joi.string().required(),
            pan_number:Joi.string().required(),
            aadhar_number:Joi.string().required(),
            address:Joi.string().required(),
        }
    },
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
    updateSupplierStatus : {
        [Segments.BODY] : {
            id : Joi.number().required(),
            status : Joi.number().required().min(-1).message("status should be -1,0 or 1").max(1).message("status should be -1,0 or 1")
        }
    }

};
