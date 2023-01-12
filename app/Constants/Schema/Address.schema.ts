import { Joi, Segments } from 'celebrate';
export default {
    
    citiesByState: { 
        [Segments.BODY]: {
            state_id: Joi.number().required(),
            key : Joi.any().optional(),
        }
    },

};
