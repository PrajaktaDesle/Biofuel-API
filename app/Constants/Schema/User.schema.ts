import { Joi, Segments } from 'celebrate';
export default {
    register: {
        [Segments.BODY]: {
            first_name: Joi.string().required(),
            middle_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required(),
            confirm_password: Joi.string().min(6).max(32).required(),
            mobile: Joi.string().min(10).required(),
            user_id: Joi.number().required(),
            status: Joi.number().max(1).required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },
    login: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },

    fetch: {
        // [Segments.BODY]: {
        //     email: Joi.string().email().required(),
        //     password: Joi.string().required()
        // },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    }
};
