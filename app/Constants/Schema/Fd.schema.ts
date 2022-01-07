import { Joi, Segments } from 'celebrate';
export default {
    createFD:{[Segments.BODY]:{
            customer_id: Joi.number().required(),
            tenure: Joi.number().required(),
            amount: Joi.number().required(),
            start_date:  Joi.date().required(),
            transaction_type: Joi.string().required()
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },

    fetchFdByCustomer:{[Segments.QUERY]:{
            customer_id: Joi.number().required(),
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    }
};
