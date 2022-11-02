import { Joi, Segments } from 'celebrate';
export default {
    
    login: { 
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(32).required()
        }
    },

};
