import { Joi, Segments } from 'celebrate';
export default {
    createNotification: {
        [Segments.BODY]: Joi.object().keys({
            delivery_date: Joi.string().required(),
            purchase_order_no: Joi.number().integer().required(),
            product_name: Joi.string().required(),
            quantity: Joi.number().integer().required(),
            count_of_vehicles: Joi.number().integer().required(),
          }).unknown(),
    },
    
    fetchNotificationById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },

    updateNotficationStatus : {
        [Segments.BODY] : {
            id : Joi.number().required(),
            status : Joi.number().required().min(-1).message("status should be 0 or 1").max(1).message("status should be -1,0 or 1")
        }
    }

};
