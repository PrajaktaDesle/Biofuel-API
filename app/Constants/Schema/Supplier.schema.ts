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
    }


};
