import { Joi, Segments } from 'celebrate';
export default {
    register: {
        [Segments.BODY]: {
            first_name: Joi.string().required().min(1).message("Minimum 1 character required"),
            middle_name: Joi.string().required().min(1).message("Minimum 1 character required"),
            last_name: Joi.string().required().min(1).message("Minimum 1 character required"),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required(),
            confirm_password: Joi.string().min(6).max(32).required(),
            mobile:Joi.string().optional().min(10).message("mobile length should be 10").max(10).message("mobile length should be 10"),
            user_id: Joi.number().required(),
            status: Joi.number().required().min(0).message("status should be 0 or 1").max(1).message("status should be 0 or 1")
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
            first_name: Joi.string().optional().min(1).message("Minimum 1 character required"),
            middle_name: Joi.string().optional().min(1).message("Minimum 1 character required"),
            last_name: Joi.string().optional().min(1).message("Minimum 1 character required"),
            email: Joi.string().email().optional(),
            mobile:Joi.string().optional().min(10).message("mobile length should be 10").max(10).message("mobile length should be 10"),
            id: Joi.number().required(),
            status:Joi.number().optional().min(0).message("status should be 0 or 1").max(1).message("status should be 0 or 1")
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().min(1).required()
        }).unknown()
    },
};
