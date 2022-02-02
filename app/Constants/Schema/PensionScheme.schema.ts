
import { Joi, Segments } from 'celebrate'

export default {
    createPensionScheme:{[Segments.BODY]:{
            customer_id: Joi.number().required(),
            start_date:  Joi.date().required(),
            tenure: Joi.number().required(),
            amount: Joi.number().required(),
            transaction_type: Joi.string().required(),
            status: Joi.number(),
            user_id: Joi.number().optional(),
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },

    fetchByCustomerId:{[Segments.QUERY]:{
            customer_id: Joi.number().required(),
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },

    fetchPensionDetails:{[Segments.QUERY]:{
            transaction_id: Joi.number().integer().required(),
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },
};