import { Joi, Segments } from 'celebrate';
export default {

    createTransConfig: {
        [Segments.BODY]: {
            id: Joi.number(),
            transaction_type: Joi.string().required(),
            tenure: Joi.number().required(),
            amount: Joi.number().required(),
            maturity_amount: Joi.number(),
            roi: Joi.number(),
            user_id: Joi.number()
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },

    fetchTransConfig: {
        [Segments.QUERY]: {
            transaction_type: Joi.string().required()
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },
};