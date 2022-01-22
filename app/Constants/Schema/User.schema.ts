import { Joi, Segments } from 'celebrate';
export default {
    register: {
        [Segments.BODY]: {
            first_name: Joi.string().min(1).required(),
            middle_name: Joi.string().min(1).required(),
            last_name: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required(),
            confirm_password: Joi.string().min(6).max(32).required(),
            mobile: Joi.string().min(10).required(),
            user_id: Joi.number().required(),
            status: Joi.number().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },
    login: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required()
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
    },

    updateUserDetails: {
        [Segments.BODY]: {
            first_name: Joi.string(),
            middle_name: Joi.string(),
            last_name: Joi.string(),
            email: Joi.string().email(),
            mobile:Joi.number(),
            status:Joi.number().optional(),
            id: Joi.number()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },
};
