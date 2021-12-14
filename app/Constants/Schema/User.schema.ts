import { Joi, Segments } from 'celebrate';
export default {
    register: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required(),
            confirm_password: Joi.string().min(6).max(32).required(),
            name: Joi.string().required(),
        },
    },
    login: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
        [Segments.HEADERS]:{
            "tenant-id": Joi.number().required(),
            "Content-Type": Joi.string().required(),
        }
    }
};
