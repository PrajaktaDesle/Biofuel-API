import { Joi, Segments } from 'celebrate';
export default {
    addBalance: {
        [Segments.BODY]: {
            customer_id: Joi.number().required(),
            amount: Joi.number().required(),
            transaction_type: Joi.string().required(),
            user_id: Joi.number().optional().default(0),
            transaction_id: Joi.number().optional()
        }
    },

    // fetch: {
    //     // [Segments.BODY]: {
    //     //     email: Joi.string().email().required(),
    //     //     password: Joi.string().required()
    //     // },
    //     [Segments.HEADERS]:Joi.object({
    //         "tenant-id": Joi.string().required()
    //     }).unknown()
    // }
};