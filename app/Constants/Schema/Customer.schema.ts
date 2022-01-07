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
            mobile: Joi.string().required(),
            user_id: Joi.number().required(),
            tenant_id: Joi.number().required(),
            status: Joi.number().required(),
            dob: Joi.string().required(),
            reg_date: Joi.string().required(),
            pancard_url:Joi.string().required(),
            aadhar_url:Joi.string().required(),
            pan_number:Joi.string().required(),
            aadhar_number:Joi.string().required(),
            address:Joi.string().required(),
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },
    login: { 
        [Segments.BODY]: {
            mobile: Joi.number().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().required()
        }).unknown()
    },
    verify_otp: {
        [Segments.BODY]:{
            otp: Joi.number().required(),
            request_id: Joi.string().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().required()
        }).unknown()

    },

    fetchAllCustomers: {
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()

    },
    fetchCustomerById:{
        [Segments.QUERY]:{
            id:Joi.number().required()
        },
        [Segments.HEADERS]: Joi.object({
            "tenant-id": Joi.number().required()
        }).unknown()
    },
    updateCustomerById: {
        [Segments.BODY]: {
            mobile: Joi.string().required(),
            id: Joi.number().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().required()
        }).unknown()
    },

    updateCustomerStatus: {
        [Segments.BODY]: {
            status: Joi.number().required(),
            id: Joi.number().required()
        },
        [Segments.HEADERS]:Joi.object({
            "tenant-id": Joi.string().required()
        }).unknown()
    },

};
