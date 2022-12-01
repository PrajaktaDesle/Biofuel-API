import { Joi, Segments } from 'celebrate';
export default {
    
    citiesByState: { 
        [Segments.QUERY]: {
            state_id: Joi.number().required(),
        }
    },

};
