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
    fetchSupplierByState:{
        [Segments.BODY]:{
            state:Joi.number().required()
        }
    },
    updateSupplierPOStatus : {
        [Segments.BODY] : {
            id : Joi.number().required(),
            status : Joi.number().required().min(-1).message("status should be 0 or 1").max(1).message("status should be -1,0 or 1")
          
        }
    }

};
