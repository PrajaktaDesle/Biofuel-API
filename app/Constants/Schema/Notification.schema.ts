import { Joi, Segments } from 'celebrate';
export default {
    createNotification: {
        [Segments.BODY]: Joi.object().keys({
            delivery_date: Joi.string().required(),
            supplier_id: Joi.number().integer().required(),
            order_no: Joi.number().integer().required(),
            product_name: Joi.string().required(),
            quantity: Joi.number().integer().required(),
            count_of_vehicles: Joi.number().integer().required(),
            user_id: Joi.number().integer().required(),
          }).unknown(),
    },
    
    fetchNotificationById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        }
    },


    updateNotifictionDetails: {
        [Segments.BODY]:  Joi.object().keys({
            id: Joi.number().required(),
            delivery_date: Joi.string().optional(),
            order_no: Joi.number().integer().optional(),
            product_name: Joi.string().optional().min(1).message("Length should be greater than 1 character"),
            quantity: Joi.number().integer().optional(),
            count_of_vehicles:Joi.number().integer().optional(),
            user_id: Joi.number().integer().optional(),

        }).unknown(),
        
    },
    updateNotficationStatus : {
        [Segments.BODY] : {
            id : Joi.number().required(),
            status : Joi.number().required().min(-1).message("status should be 0 or 1").max(1).message("status should be -1,0 or 1")
        }
    }

};
