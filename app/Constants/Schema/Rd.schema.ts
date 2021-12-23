import { Joi, Segments } from 'celebrate';
export default {
    createRD:{[Segments.BODY]:{
            customer_id: Joi.number(),
            start_date:  Joi.date().required(),
            tenure: Joi.number().required(),
            amount: Joi.number().required(),
            transaction_type: Joi.string().required(),
            status: Joi.number(),
            user_id: Joi.number(),
            id: Joi.number()
            // maturing_amount: Joi.number().required()
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },
    fetchRd:{[Segments.QUERY]:{
            customer_id: Joi.number().required(),
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    }
};