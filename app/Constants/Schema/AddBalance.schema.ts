import { Joi, Segments } from 'celebrate';
export default {
    addBalance: {
        [Segments.BODY]: {
            customer_id: Joi.number().required(),
            amount: Joi.number(),
            transaction_type: Joi.string().required(),
            user_id: Joi.number().required(),
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