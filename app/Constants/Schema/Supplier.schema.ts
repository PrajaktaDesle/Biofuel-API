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
            status : Joi.number().required().min(-1).message("status should be 0,1,2,3 or -1").max(3).message("status should be 0,1,2,3 or -1")
        }
    },
    generateChallan : {
        [Segments.BODY] : {
            quantity: Joi.string().required(),
            DeliveryDate: Joi.string().required().messages({'error':'date should be in given YYYY-MM-DD format'}),
            NotificationNo: Joi.number().required(),
            VehicleNo: Joi.string().required(),
            DriverNo: Joi.number().required(),
            TransportationRate : Joi.number().required(),
            // user_id: Joi.number().required(),
            // status : Joi.number().required().min(-1).message("status should be 0 or 1").max(1).message("status should be -1,0 or 1")
        }
    },
    notifyQuantity:{
        [Segments.BODY] : {
            approved_quantity: Joi.number().required(),
            delivery_challan_id: Joi.number().required()
        }
    },
    updateSupplierPayment : {
        [Segments.BODY] : {
            id : Joi.number().required(),
            payment_date:Joi.string().optional(),
            invoice_no:Joi.number().optional(),
            amount:Joi.number().optional(),
            utr_no :Joi.number().optional(),
            approved_quantity:Joi.number().optional(),
            status : Joi.number().optional().min(0).message("status should be 0 or 1 ").max(1).message("status should be 0 or 1")
        }
    },
    fetchNotificatonsBySupplierById:{
        [Segments.QUERY]:{
            supplier_id:Joi.number().required()
        }
    },
    fetchAllPaymentsSupplierById:{
        [Segments.QUERY]:{
            supplier_id:Joi.number().required()
        }
    },
};

